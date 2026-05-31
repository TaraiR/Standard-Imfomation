// ============================================================
// kitsune_top.cpp  -- Vitis HLS カーネル実装
//
// Python AfterImage / netStat の動作を固定長配列で再現する。
// 動的メモリ確保なし・STL なし・string なし。
//
// データ構造:
//   IncStat  → SoA (Struct of Arrays) でハッシュテーブルに格納
//   CovStat  → 同上
//   ハッシュ → リニアプロービング (最大 MAX_PROBE ステップ)
// ============================================================
#include "kitsune_top.h"
#include <cmath>

// HLS 合成時は hls_math.h の pow/exp を使う
// ソフトウェアシミュレーション時は cmath の pow を使う
#ifndef __SYNTHESIS__
  #define HLS_POW2N(e) std::pow(2.0, (e))   // 2^e
#else
  #include "hls_math.h"
  #define HLS_POW2N(e) hls::exp((e) * 0.6931471805599453)
#endif

// ===========================================================
//  IncStat ハッシュテーブル (SoA レイアウト)
// ===========================================================
template<int N>
struct IncStatTable {
    uint64_t key[N];
    double   CF1[N];
    double   CF2[N];
    double   weight[N];
    double   lastTs[N];
    bool     typeDiff[N];
    bool     valid[N];

    // key=0 は「空スロット」の番兵
    void init() {
        for (int i = 0; i < N; i++) {
#pragma HLS UNROLL factor=8
            key[i] = 0; valid[i] = false; CF1[i] = CF2[i] = weight[i] = lastTs[i] = 0.0;
        }
    }

    // ---- リニアプロービングによる lookup ----
    // 戻り値: インデックス (見つからない場合 -1)
    int find(uint64_t k) const {
#pragma HLS INLINE
        int base = (int)((k >> 1) % (uint64_t)N);
        for (int i = 0; i < MAX_PROBE; i++) {
#pragma HLS PIPELINE II=1
            int idx = (base + i) % N;
            if (!valid[idx])        return -1;  // 空スロット = 存在しない
            if (key[idx] == k)      return idx;
        }
        return -1;
    }

    // ---- lookup または新規登録 ----
    // 戻り値: インデックス (-1 = テーブル満杯)
    int get_or_create(uint64_t k, double initTs, bool isTypeDiff_) {
#pragma HLS INLINE
        int base = (int)((k >> 1) % (uint64_t)N);
        for (int i = 0; i < MAX_PROBE; i++) {
#pragma HLS PIPELINE II=1
            int idx = (base + i) % N;
            if (key[idx] == k)      return idx;         // 既存スロット
            if (!valid[idx]) {                           // 空スロット → 新規作成
                key[idx]      = k;
                CF1[idx]      = 0.0;
                CF2[idx]      = 0.0;
                weight[idx]   = INIT_W;                 // Python に合わせ 1e-20
                lastTs[idx]   = initTs;
                typeDiff[idx] = isTypeDiff_;
                valid[idx]    = true;
                return idx;
            }
        }
        return -1;  // テーブル満杯 (エントリを破棄)
    }
};

// ===========================================================
//  CovStat ハッシュテーブル (SoA レイアウト)
// ===========================================================
template<int N>
struct CovTable {
    uint64_t covKey[N];   // key_cov(k1, k2) — 順序不変
    uint64_t k1[N];       // ID1 のキー (登録時の順序)
    uint64_t k2[N];       // ID2 のキー
    int      idx1[N];     // IncStatTable 上のインデックス
    int      idx2[N];
    double   CF3[N];
    double   w3[N];
    double   lastTs[N];
    double   lastRes0[N]; // lastRes[0] (incStats[0] 側)
    double   lastRes1[N]; // lastRes[1] (incStats[1] 側)
    bool     valid[N];

    void init() {
        for (int i = 0; i < N; i++) {
#pragma HLS UNROLL factor=8
            valid[i] = false;
            CF3[i] = w3[i] = lastTs[i] = lastRes0[i] = lastRes1[i] = 0.0;
        }
    }

    // 順序不変キーで検索
    int find(uint64_t ck) const {
#pragma HLS INLINE
        int base = (int)((ck >> 1) % (uint64_t)N);
        for (int i = 0; i < MAX_PROBE; i++) {
#pragma HLS PIPELINE II=1
            int idx = (base + i) % N;
            if (!valid[idx])        return -1;
            if (covKey[idx] == ck)  return idx;
        }
        return -1;
    }

    // 新規登録 (必ず新規スロットを確保)
    int create(uint64_t ck, uint64_t ka, uint64_t kb, int ia, int ib, double initTs) {
#pragma HLS INLINE
        int base = (int)((ck >> 1) % (uint64_t)N);
        for (int i = 0; i < MAX_PROBE; i++) {
#pragma HLS PIPELINE II=1
            int idx = (base + i) % N;
            if (!valid[idx]) {
                covKey[idx]  = ck;
                k1[idx]      = ka;
                k2[idx]      = kb;
                idx1[idx]    = ia;
                idx2[idx]    = ib;
                CF3[idx]     = 0.0;
                w3[idx]      = INIT_W;
                lastTs[idx]  = initTs;
                lastRes0[idx]= 0.0;
                lastRes1[idx]= 0.0;
                valid[idx]   = true;
                return idx;
            }
        }
        return -1;
    }
};

// ===========================================================
//  IncStat 操作 (インライン関数)
// ===========================================================

// decay 処理: CF1, CF2, weight, lastTs を更新
template<int N>
static void stat_decay(IncStatTable<N>& T, int idx, double ts) {
#pragma HLS INLINE
    double dt = ts - T.lastTs[idx];
    if (dt > 0.0) {
        double f = HLS_POW2N(-T.lastTs[idx] * 0.0); // placeholder → 以下で正確に計算
        // 注: T.lastTs[idx] は lambda を持たないので、呼び出し元で lambda を渡す
        // → 実際は stat_decay_lam() を使う
        (void)f;
    }
}

// lambda を受け取る decay 関数 (実際に使うもの)
template<int N>
static void stat_decay_lam(IncStatTable<N>& T, int idx, double ts, double lambda) {
#pragma HLS INLINE
    double dt = ts - T.lastTs[idx];
    if (dt > 0.0) {
        double f = HLS_POW2N(-lambda * dt);
        T.CF1[idx]    *= f;
        T.CF2[idx]    *= f;
        T.weight[idx] *= f;
        T.lastTs[idx]  = ts;
    }
}

// insert: decay 後に値を追加
template<int N>
static void stat_insert(IncStatTable<N>& T, int idx, double v, double ts, double lambda) {
#pragma HLS INLINE
    if (T.typeDiff[idx]) {
        double dt = ts - T.lastTs[idx];
        v = (dt > 0.0) ? dt : 0.0;
    }
    stat_decay_lam(T, idx, ts, lambda);
    T.CF1[idx]    += v;
    T.CF2[idx]    += v * v;
    T.weight[idx] += 1.0;
    T.lastTs[idx]  = ts;
}

// 1D 統計取得: [weight, mean, variance]
// idx < 0 はテーブル満杯時の番兵 → 安全にゼロを返す
template<int N>
static void stat_get1D(const IncStatTable<N>& T, int idx,
                        double& w, double& mean, double& var) {
#pragma HLS INLINE
    if (idx < 0) { w = mean = var = 0.0; return; }
    w    = T.weight[idx];
    mean = T.CF1[idx] / w;
    var  = std::abs(T.CF2[idx] / w - mean * mean);
}

// ===========================================================
//  CovStat 操作 (インライン関数)
// ===========================================================

template<int NS, int NC>
static void cov_decay(CovTable<NC>& C, int ci,
                       IncStatTable<NS>& S, int inc,
                       double ts, double lambda) {
#pragma HLS INLINE
    double dt = ts - C.lastTs[ci];
    if (dt > 0.0) {
        double f = HLS_POW2N(-lambda * dt);
        C.CF3[ci]  *= f;
        C.w3[ci]   *= f;
        C.lastTs[ci] = ts;
        // Python: lastRes[inc] だけ decay (片側のみ)
        if (inc == 0) C.lastRes0[ci] *= f;
        else          C.lastRes1[ci] *= f;
    }
}

// update_cov: inc=0 なら ID1 側の更新, inc=1 なら ID2 側
template<int NS, int NC>
static void cov_update(CovTable<NC>& C, int ci,
                        IncStatTable<NS>& S, int inc,
                        double v, double ts, double lambda) {
#pragma HLS INLINE
    // 相手側の decay
    int other_sidx = (inc == 0) ? C.idx2[ci] : C.idx1[ci];
    if (other_sidx >= 0) stat_decay_lam(S, other_sidx, ts, lambda);

    // cov 自身の decay (片側 lastRes のみ)
    cov_decay(C, ci, S, inc, ts, lambda);

    // mean を取得 (現在の inc 側)
    int my_sidx = (inc == 0) ? C.idx1[ci] : C.idx2[ci];
    double w_tmp, mean_tmp, var_tmp;
    stat_get1D(S, my_sidx, w_tmp, mean_tmp, var_tmp);

    double res  = v - mean_tmp;
    double other_lastRes = (inc == 0) ? C.lastRes1[ci] : C.lastRes0[ci];
    double resid = res * other_lastRes;

    C.CF3[ci] += resid;
    C.w3[ci]  += 1.0;

    if (inc == 0) C.lastRes0[ci] = res;
    else          C.lastRes1[ci] = res;
}

// 2D 統計取得: [radius, magnitude, cov, pcc]
// ci < 0 またはいずれかの stat が登録されていない場合はゼロを返す
template<int NS, int NC>
static void cov_get2D(const CovTable<NC>& C, int ci,
                       const IncStatTable<NS>& S,
                       double& radius, double& magnitude,
                       double& cov_val, double& pcc) {
#pragma HLS INLINE
    if (ci < 0 || C.idx1[ci] < 0 || C.idx2[ci] < 0) {
        radius = magnitude = cov_val = pcc = 0.0; return;
    }
    double w1, m1, v1, w2, m2, v2;
    stat_get1D(S, C.idx1[ci], w1, m1, v1);
    stat_get1D(S, C.idx2[ci], w2, m2, v2);

    // radius = sqrt(var1^2 + var2^2)
    radius    = std::sqrt(v1 * v1 + v2 * v2);
    // magnitude = sqrt(mean1^2 + mean2^2)
    magnitude = std::sqrt(m1 * m1 + m2 * m2);
    // covariance
    cov_val   = C.CF3[ci] / C.w3[ci];
    // PCC
    double std1 = std::sqrt(v1), std2 = std::sqrt(v2);
    pcc = (std1 > 0.0 && std2 > 0.0) ? cov_val / (std1 * std2) : 0.0;
}

// ===========================================================
//  StatDB: update_get_1D_Stats
// ===========================================================
template<int NS>
static void db_update1D(IncStatTable<NS>& S,
                         uint64_t key, double ts, double v,
                         double lambda, bool isTypeDiff,
                         double& w, double& mean, double& var) {
#pragma HLS INLINE
    int idx = S.get_or_create(key, ts, isTypeDiff);
    if (idx < 0) { w = mean = var = 0.0; return; }
    stat_insert(S, idx, v, ts, lambda);
    stat_get1D(S, idx, w, mean, var);
}

// ===========================================================
//  StatDB: update_get_1D2D_Stats
//  Python の動作を完全再現:
//    1) update_get_1D_Stats(ID1) → 1D統計を ID1 から
//    2) cov が既存なら updateCov を 2 回呼ぶ (insert 自動伝播 + 明示呼び出し)
//    3) 結果: [w(ID1), mean(ID1), var(ID1), radius, magnitude, cov, pcc]
// ===========================================================
template<int NS, int NC>
static void db_update1D2D(IncStatTable<NS>& S, CovTable<NC>& C,
                           uint64_t k1, uint64_t k2,
                           double ts, double v, double lambda,
                           double out[7]) {
#pragma HLS INLINE
    // covAlreadyExists: 双方向キーで確認
    uint64_t ck = key_cov(k1, k2);
    int ci = C.find(ck);
    bool covExists = (ci >= 0);

    // 1D: ID1 ストリームを更新
    double w1, m1, v1;
    db_update1D(S, k1, ts, v, lambda, false, w1, m1, v1);
    int idx1 = S.find(k1);

    // ID2 ストリームを登録 (insert なし)
    int idx2 = S.get_or_create(k2, ts, false);

    // Cov の登録または取得
    if (ci < 0) {
        ci = C.create(ck, k1, k2, idx1, idx2, ts);
    }

    if (ci < 0) {
        // テーブル満杯 → ゼロで返す
        out[0] = w1; out[1] = m1; out[2] = v1;
        out[3] = out[4] = out[5] = out[6] = 0.0;
        return;
    }

    // inc の決定: k1 が cov の k1 側なら inc=0、k2 側なら inc=1
    int inc = (C.k1[ci] == k1) ? 0 : 1;

    // Python の二重更新を再現
    if (covExists) {
        cov_update(C, ci, S, inc, v, ts, lambda);
    }
    cov_update(C, ci, S, inc, v, ts, lambda);

    // 2D 統計取得
    double radius, mag, cov_val, pcc;
    cov_get2D(C, ci, S, radius, mag, cov_val, pcc);

    out[0] = w1;  out[1] = m1;  out[2] = v1;
    out[3] = radius; out[4] = mag; out[5] = cov_val; out[6] = pcc;
}

// ===========================================================
//  静的ハッシュテーブル (関数ローカル static → BRAM に合成)
// ===========================================================
// 注意: Vitis HLS では static 変数は関数呼び出し間で保持される
static IncStatTable<HT_MI_CAP>  ht_mi;
static IncStatTable<HT_H_CAP>   ht_h;
static IncStatTable<HT_JIT_CAP> ht_jit;
static IncStatTable<HT_HP_CAP>  ht_hp;
static CovTable<COV_H_CAP>      cov_h;
static CovTable<COV_HP_CAP>     cov_hp;
static bool initialized = false;

// ===========================================================
//  トップ関数
// ===========================================================
void kitsune_update(const PacketInfo& pkt, double features[FEAT_TOTAL])
{
// ---- HLS インターフェース宣言 ----------------------------
#pragma HLS INTERFACE ap_ctrl_hs    port=return
#pragma HLS INTERFACE ap_none       port=pkt
#pragma HLS INTERFACE ap_memory     port=features

// ---- BRAM パーティション (アクセス高速化) ----------------
#pragma HLS ARRAY_PARTITION variable=ht_mi.CF1  cyclic factor=4
#pragma HLS ARRAY_PARTITION variable=ht_mi.CF2  cyclic factor=4
#pragma HLS ARRAY_PARTITION variable=ht_h.CF1   cyclic factor=4
#pragma HLS ARRAY_PARTITION variable=ht_h.CF2   cyclic factor=4

// ---- URAM 割り当て (4096エントリの大テーブル) ------------
// valid/typeDiff (1bit) は BRAM のまま。それ以外を URAM へ。
// ht_hp (HT_HP_CAP=4096)
#pragma HLS BIND_STORAGE variable=ht_hp.key      type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_hp.CF1      type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_hp.CF2      type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_hp.weight   type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_hp.lastTs   type=ram_2p impl=uram
// ht_jit (HT_JIT_CAP=4096)
#pragma HLS BIND_STORAGE variable=ht_jit.key     type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_jit.CF1     type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_jit.CF2     type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_jit.weight  type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=ht_jit.lastTs  type=ram_2p impl=uram
// cov_hp (COV_HP_CAP=4096)
#pragma HLS BIND_STORAGE variable=cov_hp.covKey   type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.k1       type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.k2       type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.CF3      type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.w3       type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.lastTs   type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.lastRes0 type=ram_2p impl=uram
#pragma HLS BIND_STORAGE variable=cov_hp.lastRes1 type=ram_2p impl=uram

    // 初回のみ zero-init (HLS では static は自動で 0 になるが明示)
    if (!initialized) {
        ht_mi.init(); ht_h.init(); ht_jit.init(); ht_hp.init();
        cov_h.init(); cov_hp.init();
        initialized = true;
    }

    double ts    = pkt.timestamp;
    double flen  = pkt.framelen;
    uint32_t sIP = pkt.srcIP;
    uint32_t dIP = pkt.dstIP;
    uint64_t sMAC = pkt.srcMAC & 0xFFFFFFFFFFFFULL;
    uint64_t dMAC = pkt.dstMAC & 0xFFFFFFFFFFFFULL;

    // ---- 特徴量バッファ ------------------------------------
    double feat[FEAT_TOTAL];
#pragma HLS ARRAY_PARTITION variable=feat complete

    // ---- 各 lambda でループ --------------------------------
LAMBDA_LOOP:
    for (int li = 0; li < NUM_LAMBDAS; li++) {
#pragma HLS PIPELINE
        double lam = LAMBDAS[li];
        int    base_mi  = li * 3;
        int    base_hh  = NUM_LAMBDAS * 3  + li * 7;
        int    base_jit = NUM_LAMBDAS * 10 + li * 3;
        int    base_hp  = NUM_LAMBDAS * 13 + li * 7;

        // ==== (1) MI: srcMAC + srcIP ========================
        {
            uint64_t k = key_mac_ip(sMAC, sIP, li);
            double w, m, v;
            db_update1D(ht_mi, k, ts, flen, lam, false, w, m, v);
            feat[base_mi + 0] = w;
            feat[base_mi + 1] = m;
            feat[base_mi + 2] = v;
        }

        // ==== (2) HH: srcIP ↔ dstIP =========================
        {
            uint64_t k1 = key_ip(sIP, li);
            uint64_t k2 = key_ip(dIP, li);
            double out[7];
            db_update1D2D(ht_h, cov_h, k1, k2, ts, flen, lam, out);
            for (int j = 0; j < 7; j++) feat[base_hh + j] = out[j];
        }

        // ==== (3) HH-jitter: srcIP+dstIP (isTypeDiff=true) ==
        {
            uint64_t k = key_ip_pair(sIP, dIP, li);
            double w, m, v;
            db_update1D(ht_jit, k, ts, 0.0, lam, true, w, m, v);
            feat[base_jit + 0] = w;
            feat[base_jit + 1] = m;
            feat[base_jit + 2] = v;
        }

        // ==== (4) HpHp: srcIP+port ↔ dstIP+port (or MAC for ARP)
        {
            uint64_t k1, k2;
            if (pkt.protocol == PROTO_ARP) {
                k1 = key_mac(sMAC, li);
                k2 = key_mac(dMAC, li);
            } else {
                k1 = key_ip_port(sIP, pkt.srcPort, li);
                k2 = key_ip_port(dIP, pkt.dstPort, li);
            }
            double out[7];
            db_update1D2D(ht_hp, cov_hp, k1, k2, ts, flen, lam, out);
            for (int j = 0; j < 7; j++) feat[base_hp + j] = out[j];
        }
    }

    // 出力コピー
OUTPUT_COPY:
    for (int i = 0; i < FEAT_TOTAL; i++) {
#pragma HLS PIPELINE
        features[i] = feat[i];
    }
}
