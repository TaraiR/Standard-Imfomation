#include "NetStat.h"
#include <cmath>
#include <sstream>
#include <iostream>

NetStat::NetStat(std::vector<double> lambdas, size_t hostLimit, size_t hostSimplexLimit)
    : Lambdas(std::move(lambdas)),
    HostLimit(hostLimit),
    SessionLimit(hostLimit* hostLimit* hostSimplexLimit),
    MAC_HostLimit(hostLimit * 10),
    HT_jit(HostLimit* HostLimit),
    HT_MI(MAC_HostLimit),
    HT_H(HostLimit),
    HT_Hp(SessionLimit) {
}

std::pair<std::string, std::string> NetStat::findDirection(int IPtype, const std::string& srcIP, const std::string& dstIP, const std::string& eth_src, const std::string& eth_dst) {
    std::string src_subnet, dst_subnet;
    if (IPtype == 0) { // IPv4
        src_subnet = srcIP.substr(0, srcIP.rfind('.'));
        dst_subnet = dstIP.substr(0, dstIP.rfind('.'));
    }
    else if (IPtype == 1) { // IPv6
        src_subnet = srcIP.substr(0, srcIP.size() / 2);
        dst_subnet = dstIP.substr(0, dstIP.size() / 2);
    }
    else { // No network layer, use MACs
        src_subnet = eth_src;
        dst_subnet = eth_dst;
    }
    return { src_subnet, dst_subnet };
}

std::vector<double> NetStat::updateGetStats(
    int IPtype, const std::string& srcMAC, const std::string& dstMAC,
    const std::string& srcIP, const std::string& srcProtocol,
    const std::string& dstIP, const std::string& dstProtocol,
    double datagramSize, double timestamp) {

    std::vector<double> MIstat(Lambdas.size() * 3);
    std::vector<double> HHstat(Lambdas.size() * 7);
    std::vector<double> HHstat_jit(Lambdas.size() * 3);
    std::vector<double> HpHpstat(Lambdas.size() * 7);

    // MAC-IP 統計を更新・取得
    for (size_t i = 0; i < Lambdas.size(); ++i) {
        std::string ID = srcMAC + srcIP;  // ID を生成
        auto stats = HT_MI.update_get_1D_Stats(ID, timestamp, datagramSize, Lambdas[i]);

        std::copy(stats.begin(), stats.end(), MIstat.begin() + i * 3);
    }

    // Host-Host 統計を更新・取得
    for (size_t i = 0; i < Lambdas.size(); ++i) {
        std::string ID1 = srcIP;   // Source IP を基に ID を生成
        std::string ID2 = dstIP;   // Destination IP を基に ID を生成
        auto stats = HT_H.update_get_1D2D_Stats(ID1, ID2, timestamp, datagramSize, Lambdas[i]);
        std::copy(stats.begin(), stats.end(), HHstat.begin() + i * 7);

        //std::cout << "HHstat for " << ID1 << " | " << ID2 << " at lambda " << Lambdas[i] << ": ";
        //for (const auto& val : stats) std::cout << val << " ";
        //std::cout << std::endl;
    }

    // Host-Host Jitter 統計を更新・取得
    for (size_t i = 0; i < Lambdas.size(); ++i) {
        std::string ID = srcIP + dstIP;  // ID を生成
        auto stats = HT_jit.update_get_1D_Stats(ID, timestamp, 0, Lambdas[i], true);
        std::copy(stats.begin(), stats.end(), HHstat_jit.begin() + i * 3);

        
    }

    // Host-Host Protocol 統計を更新・取得
    if (srcProtocol == "arp") {
        for (size_t i = 0; i < Lambdas.size(); ++i) {
            std::string ID1 = srcMAC;
            std::string ID2 = dstMAC;
            auto stats = HT_Hp.update_get_1D2D_Stats(ID1, ID2, timestamp, datagramSize, Lambdas[i]);
            std::copy(stats.begin(), stats.end(), HpHpstat.begin() + i * 7);
        }
    } else {
        for (size_t i = 0; i < Lambdas.size(); ++i) {
            std::string ID1 = srcIP + srcProtocol;
            std::string ID2 = dstIP + dstProtocol;
            auto stats = HT_Hp.update_get_1D2D_Stats(ID1, ID2, timestamp, datagramSize, Lambdas[i]);
            std::copy(stats.begin(), stats.end(), HpHpstat.begin() + i * 7);

            // std::cout << "HpHpstat for " << ID1 << " | " << ID2 << " at lambda " << Lambdas[i] << ": ";
            //for (const auto& val : stats) std::cout << val << " ";
            //std::cout << std::endl;
        }
    }

    // 結果を結合して返す
    MIstat.insert(MIstat.end(), HHstat.begin(), HHstat.end());
    MIstat.insert(MIstat.end(), HHstat_jit.begin(), HHstat_jit.end());
    MIstat.insert(MIstat.end(), HpHpstat.begin(), HpHpstat.end());
    return MIstat;
}

std::vector<std::string> NetStat::getNetStatHeaders() {
    std::vector<std::string> headers;

    // 各 Lambda に対するヘッダーを生成
    for (const auto& lambda : Lambdas) {
        std::string ID = "srcMAC+srcIP";  // 適切な値で生成
        std::string ID1 = "srcIP";        // 適切な値で生成
        std::string ID2 = "dstIP";        // 適切な値で生成

        // MAC-IP 用ヘッダー
        auto miHeaders = HT_MI.getHeadersND({ID});
        for (const auto& h : miHeaders) {
            headers.push_back("MI_dir_" + h);
        }

        // Host-Host 用ヘッダー
        auto hhHeaders = HT_H.getHeadersND({ID1, ID2});
        for (const auto& h : hhHeaders) {
            headers.push_back("HH_" + h);
        }

        // Host-Host Jitter 用ヘッダー
        auto hhJitHeaders = HT_jit.getHeadersND({ID});
        for (const auto& h : hhJitHeaders) {
            headers.push_back("HH_jit_" + h);
        }

        // Host-Host Protocol 用ヘッダー
        auto hpHpHeaders = HT_Hp.getHeadersND({ID1, ID2});
        for (const auto& h : hpHpHeaders) {
            headers.push_back("HpHp_" + h);
        }
    }

    return headers;
}
