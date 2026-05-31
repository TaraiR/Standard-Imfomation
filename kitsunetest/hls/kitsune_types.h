#pragma once
// ============================================================
// kitsune_types.h  -- 型定義・定数・ハッシュ関数
// Vitis HLS 合成対象。std::string / 動的メモリ不使用。
// ============================================================
#include <cstdint>
#include <cmath>

// ---- 特徴量レイアウト (100次元) ---------------------------
//  MI    : 3 * 5 =  15   (weight, mean, var)
//  HH    : 7 * 5 =  35   (weight, mean, var, radius, mag, cov, pcc)
//  HH_jit: 3 * 5 =  15
//  HpHp  : 7 * 5 =  35
//  合計  = 100
// -----------------------------------------------------------

constexpr int NUM_LAMBDAS = 5;
constexpr double LAMBDAS[NUM_LAMBDAS] = {5.0, 3.0, 1.0, 0.1, 0.01};

constexpr int FEAT_TOTAL = 100;

// ---- ハッシュテーブルサイズ (2の累乗推奨) ----------------
// 各エントリは「元の文字列ID × lambda_idx」に対応する1つのIncStat
// ★ FPGA 搭載時は BRAM 使用量とトレードオフで縮小可能
constexpr int HT_MI_CAP  = 2048;  // srcMAC+srcIP  × 5λ
constexpr int HT_H_CAP   = 2048;  // srcIP/dstIP   × 5λ (255*2*5 = 2550)
constexpr int HT_JIT_CAP = 4096;  // srcIP+dstIP jitter × 5λ
constexpr int HT_HP_CAP  = 4096;  // srcIP+port   × 5λ (多数の一意フロー対応)

constexpr int COV_H_CAP  = 2048;  // HH covariance pairs × 5λ
constexpr int COV_HP_CAP = 4096;  // HpHp covariance pairs × 5λ

constexpr int MAX_PROBE   = 16;   // リニアプロービングの最大試行数
constexpr double INIT_W   = 1e-20;// Python に合わせた初期ウェイト

// ---- プロトコル識別子 ------------------------------------
constexpr uint8_t PROTO_OTHER = 0;
constexpr uint8_t PROTO_ICMP  = 1;
constexpr uint8_t PROTO_ARP   = 2;
constexpr uint8_t PROTO_PORT  = 3; // TCP/UDP (ポート番号あり)

// ---- 入力パケット情報 ------------------------------------
// FeatureExtractor (ソフトウェア側) が TSV を解析して渡す
struct PacketInfo {
    double   timestamp;
    double   framelen;
    int      IPtype;        // 0=IPv4, 1=IPv6, -1=なし
    uint32_t srcIP;         // IPv4: ビッグエンディアン32bit
    uint32_t dstIP;
    uint64_t srcMAC;        // 48bit packed into lower 48 bits
    uint64_t dstMAC;
    uint8_t  protocol;      // PROTO_xxx
    uint16_t srcPort;       // TCP/UDP ポート (PROTO_PORT のとき有効)
    uint16_t dstPort;
};

// ---- ハッシュ関数 ----------------------------------------
// 64bit → 64bit 乱数混合 (HLS INLINE 可)
inline uint64_t hash64(uint64_t k) {
    k = (~k) + (k << 21);
    k ^= (k >> 24);
    k += (k << 3) + (k << 8);
    k ^= (k >> 14);
    k += (k << 2) + (k << 4);
    k ^= (k >> 28);
    k += (k << 31);
    return k | 1ULL; // 0 は「空スロット」予約のため | 1 で0を回避
}

// IPv4 32bit + lambda_idx → 64bit key
inline uint64_t key_ip(uint32_t ip, int li) {
    return hash64(((uint64_t)ip << 3) | (uint64_t)li);
}

// IPペア (srcIP, dstIP) + lambda_idx → 64bit key (順序依存)
inline uint64_t key_ip_pair(uint32_t a, uint32_t b, int li) {
    return hash64(((uint64_t)a << 35) | ((uint64_t)b << 3) | (uint64_t)li);
}

// MAC(48bit) + IP(32bit) + lambda_idx → 64bit key
inline uint64_t key_mac_ip(uint64_t mac, uint32_t ip, int li) {
    return hash64((mac & 0xFFFFFFFFFFFFULL) ^ (((uint64_t)ip << 3) | (uint64_t)li));
}

// IP + port + lambda_idx → 64bit key
inline uint64_t key_ip_port(uint32_t ip, uint16_t port, int li) {
    return hash64(((uint64_t)ip << 19) | ((uint64_t)port << 3) | (uint64_t)li);
}

// MAC + lambda_idx → 64bit key (ARP 用)
inline uint64_t key_mac(uint64_t mac, int li) {
    return hash64(((mac & 0xFFFFFFFFFFFFULL) << 3) | (uint64_t)li);
}

// covariance の順序不変キー (XOR で順序をなくす)
inline uint64_t key_cov(uint64_t k1, uint64_t k2) {
    return hash64(k1 ^ k2);
}
