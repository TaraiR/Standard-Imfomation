// ============================================================
// kitsune_tb.cpp  -- Vitis HLS テストベンチ
//
// 同一パケット列を
//   (A) Reference C++ (NetStat::updateGetStats)
//   (B) HLS カーネル (kitsune_update)
// の両方で処理し、100次元特徴量を比較する。
//
// コンパイル例 (g++):
//   g++ -std=c++17 -I.. kitsune_tb.cpp kitsune_top.cpp
//       ../AfterImage.cpp ../NetStat.cpp -lm -o kitsune_tb
// ============================================================
#include "kitsune_top.h"
#include "../NetStat.h"
#include "../AfterImage.h"

#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <iostream>
#include <iomanip>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <algorithm>

// -----------------------------------------------------------
//  IP / MAC / Port 文字列 → 数値変換
// -----------------------------------------------------------

// FNV-1a 32-bit string hash — injective enough for small address sets.
// Used for IPv6 addresses and L2 MAC-as-IP strings so they get unique
// (non-zero) uint32 identifiers instead of parse_ipv4 returning 0.
static uint32_t str_hash32(const std::string& s) {
    uint32_t h = 2166136261u;
    for (unsigned char c : s) { h ^= c; h *= 16777619u; }
    return h ? h : 1u;  // 0 は HLS ハッシュテーブルの「空スロット」予約
}

static uint32_t parse_ipv4(const std::string& s) {
    if (s.empty()) return 0;
    unsigned a = 0, b = 0, c = 0, d = 0;
    if (std::sscanf(s.c_str(), "%u.%u.%u.%u", &a, &b, &c, &d) == 4)
        return ((uint32_t)a << 24) | ((uint32_t)b << 16) | ((uint32_t)c << 8) | (uint32_t)d;
    return 0;
}

static uint64_t parse_mac(const std::string& s) {
    if (s.empty()) return 0;
    unsigned a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
    if (std::sscanf(s.c_str(), "%x:%x:%x:%x:%x:%x", &a, &b, &c, &d, &e, &f) == 6)
        return ((uint64_t)a << 40) | ((uint64_t)b << 32) | ((uint64_t)c << 24) |
               ((uint64_t)d << 16) | ((uint64_t)e << 8)  | (uint64_t)f;
    return 0;
}

static uint16_t parse_port(const std::string& s) {
    if (s.empty()) return 0;
    return (uint16_t)std::stoi(s);
}

// -----------------------------------------------------------
//  TSV 1行を解析して PacketInfo と NetStat 用引数を同時生成
// -----------------------------------------------------------
// TSV 列順序 (tshark -T fields):
//  0  frame.time_epoch    1  frame.len
//  2  eth.src             3  eth.dst
//  4  ip.src              5  ip.dst
//  6  tcp.srcport         7  tcp.dstport
//  8  udp.srcport         9  udp.dstport
//  10 icmp.type           11 icmp.code
//  12 arp.opcode          13 arp.src.hw_mac
//  14 arp.src.proto_ipv4  15 arp.dst.hw_mac
//  16 arp.dst.proto_ipv4  17 ipv6.src   18 ipv6.dst
// -----------------------------------------------------------
struct ParsedRow {
    PacketInfo pkt;
    // Reference C++ 用引数
    int         ref_IPtype;
    std::string ref_srcMAC, ref_dstMAC;
    std::string ref_srcIP,  ref_dstIP;
    std::string ref_srcProto, ref_dstProto;
    double      ref_frameLen, ref_ts;
    bool        valid;
};

static ParsedRow parse_row(const std::vector<std::string>& row) {
    ParsedRow pr{};
    pr.valid = false;
    if (row.size() < 17) return pr;

    double ts      = std::stod(row[0]);
    double framelen = std::stod(row[1]);

    std::string srcMAC   = row[2];
    std::string dstMAC   = row[3];
    std::string srcIP    = row[4];
    std::string dstIP    = row[5];
    // TCP port か UDP port の一方が入っている (もう一方は空)
    std::string srcProto = row[6] + row[8];
    std::string dstProto = row[7] + row[9];

    int IPtype = -1;
    if (!srcIP.empty()) {
        IPtype = 0;
    } else if (row.size() > 18 && !row[17].empty()) {
        srcIP  = row[17];
        dstIP  = row[18];
        IPtype = 1;
    }

    uint8_t  proto_id = PROTO_OTHER;
    uint16_t srcPort  = 0;
    uint16_t dstPort  = 0;

    if (srcProto.empty()) {
        if (!row[12].empty()) {              // ARP
            srcProto = "arp";
            dstProto = "arp";
            srcMAC   = row[13];             // arp.src.hw_mac
            dstMAC   = row[15];             // arp.dst.hw_mac
            srcIP    = row[14];             // arp.src.proto_ipv4
            dstIP    = row[16];             // arp.dst.proto_ipv4
            IPtype   = 0;
            proto_id = PROTO_ARP;
        } else if (!row[10].empty()) {       // ICMP
            srcProto = "icmp";
            dstProto = "icmp";
            IPtype   = 0;
            proto_id = PROTO_ICMP;
        } else if (srcIP.empty() && dstIP.empty()) {
            srcIP = row[2];                  // MAC で代替
            dstIP = row[3];
        }
    } else {
        proto_id = PROTO_PORT;
        srcPort  = parse_port(row[6]);
        if (srcPort == 0) srcPort = parse_port(row[8]);
        dstPort  = parse_port(row[7]);
        if (dstPort == 0) dstPort = parse_port(row[9]);
    }

    // PacketInfo 構築
    // IPv4 → parse_ipv4, IPv6 / L2 → str_hash32 で非ゼロの一意識別子を付与
    // (HLS の key_ip / key_ip_port でストリームを区別できるようにする)
    auto ip_to_uint32 = [&](const std::string& ip_str) -> uint32_t {
        uint32_t v = parse_ipv4(ip_str);
        return v ? v : str_hash32(ip_str);  // IPv4 失敗時は文字列ハッシュ
    };

    pr.pkt.timestamp = ts;
    pr.pkt.framelen  = framelen;
    pr.pkt.IPtype    = IPtype;
    pr.pkt.srcIP     = ip_to_uint32(srcIP);
    pr.pkt.dstIP     = ip_to_uint32(dstIP);
    pr.pkt.srcMAC    = parse_mac(srcMAC);
    pr.pkt.dstMAC    = parse_mac(dstMAC);
    pr.pkt.protocol  = proto_id;
    pr.pkt.srcPort   = srcPort;
    pr.pkt.dstPort   = dstPort;

    // Reference 用文字列引数
    pr.ref_IPtype    = IPtype;
    pr.ref_srcMAC    = srcMAC;
    pr.ref_dstMAC    = dstMAC;
    pr.ref_srcIP     = srcIP;
    pr.ref_dstIP     = dstIP;
    pr.ref_srcProto  = srcProto;
    pr.ref_dstProto  = dstProto;
    pr.ref_frameLen  = framelen;
    pr.ref_ts        = ts;
    pr.valid         = true;
    return pr;
}

// -----------------------------------------------------------
//  特徴量グループ名 (デバッグ用)
// -----------------------------------------------------------
static const char* feat_name(int idx) {
    // 各グループの先頭インデックス
    // MI   [0..14]   : li*3
    // HH   [15..49]  : 15 + li*7
    // HHjit[50..64]  : 50 + li*3
    // HpHp [65..99]  : 65 + li*7
    if (idx < 15)  return "MI";
    if (idx < 50)  return "HH";
    if (idx < 65)  return "HHjit";
    return "HpHp";
}

// -----------------------------------------------------------
//  main
// -----------------------------------------------------------
int main(int argc, char* argv[]) {
    const char* tsv_path = (argc > 1) ? argv[1] : "../mirai_pcap/mirai.pcap.tsv";
    int max_pkts = (argc > 2) ? std::stoi(argv[2]) : INT_MAX;

    std::ifstream tsv_file(tsv_path);
    if (!tsv_file.is_open()) {
        std::cerr << "Cannot open TSV: " << tsv_path << "\n";
        std::cerr << "Usage: kitsune_tb <tsv_path> [max_packets]\n";
        return 1;
    }

    // ヘッダー行をスキップ
    std::string header_line;
    std::getline(tsv_file, header_line);

    NetStat ref_ns;

    int pass_count = 0;
    int fail_count = 0;
    int pkt_idx    = 0;

    const double TOL_REL = 1e-6;   // 相対誤差許容値

    std::cout << std::fixed << std::setprecision(12);

    std::string line;
    while (std::getline(tsv_file, line) && pkt_idx < max_pkts) {
        // TSV 行を列に分割
        std::vector<std::string> row;
        {
            std::istringstream ss(line);
            std::string cell;
            while (std::getline(ss, cell, '\t')) row.push_back(cell);
        }

        ParsedRow pr = parse_row(row);
        if (!pr.valid) continue;

        // ---- (A) Reference C++ --------------------------------
        std::vector<double> ref_feat = ref_ns.updateGetStats(
            pr.ref_IPtype,
            pr.ref_srcMAC, pr.ref_dstMAC,
            pr.ref_srcIP,  pr.ref_srcProto,
            pr.ref_dstIP,  pr.ref_dstProto,
            pr.ref_frameLen, pr.ref_ts);

        // ---- (B) HLS カーネル ----------------------------------
        double hls_feat[FEAT_TOTAL] = {};
        kitsune_update(pr.pkt, hls_feat);

        // ---- 比較 ----------------------------------------------
        bool ok = true;
        std::vector<int> mismatches;

        int cmp_len = (int)std::min((size_t)FEAT_TOTAL, ref_feat.size());
        for (int i = 0; i < cmp_len; i++) {
            double tol  = TOL_REL * std::max(1.0, std::abs(ref_feat[i]));
            double diff = std::abs(ref_feat[i] - hls_feat[i]);
            if (diff > tol) {
                ok = false;
                mismatches.push_back(i);
            }
        }

        if (ok) {
            std::cout << "[Pkt " << std::setw(4) << pkt_idx << "] PASS\n";
            pass_count++;
        } else {
            std::cout << "[Pkt " << std::setw(4) << pkt_idx << "] FAIL  ("
                      << mismatches.size() << " features)\n";
            for (int i : mismatches) {
                double diff = std::abs(ref_feat[i] - hls_feat[i]);
                double tol  = TOL_REL * std::max(1.0, std::abs(ref_feat[i]));
                std::cout << "    feat[" << std::setw(3) << i << "] "
                          << std::setw(6) << feat_name(i)
                          << "  ref=" << std::setw(18) << ref_feat[i]
                          << "  hls=" << std::setw(18) << hls_feat[i]
                          << "  diff=" << diff
                          << "  tol=" << tol << "\n";
            }
            fail_count++;
        }

        pkt_idx++;
    }

    std::cout << "\n=== Summary ===\n"
              << "  Packets : " << pkt_idx     << "\n"
              << "  PASS    : " << pass_count  << "\n"
              << "  FAIL    : " << fail_count  << "\n";

    return (fail_count > 0) ? 1 : 0;
}
