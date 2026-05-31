#ifndef NETSTAT_H
#define NETSTAT_H

#include <string>
#include <vector>
#include <unordered_map>
#include "AfterImage.h"

class NetStat {
private:
    std::vector<double> Lambdas;
    size_t HostLimit;
    size_t SessionLimit;
    size_t MAC_HostLimit;

    IncStatDB HT_jit; // Host-Host Jitter Stats
    IncStatDB HT_MI;  // MAC-IP relationships
    IncStatDB HT_H;   // Source Host BW Stats
    IncStatDB HT_Hp;  // Source Host Session Stats

public:
    NetStat(std::vector<double> lambdas = { 5, 3, 1, 0.1, 0.01 }, size_t hostLimit = 255, size_t hostSimplexLimit = 1000);

    std::pair<std::string, std::string> findDirection(int IPtype, const std::string& srcIP, const std::string& dstIP, const std::string& eth_src, const std::string& eth_dst);

    std::vector<double> updateGetStats(int IPtype, const std::string& srcMAC, const std::string& dstMAC, const std::string& srcIP, const std::string& srcProtocol,
        const std::string& dstIP, const std::string& dstProtocol, double datagramSize, double timestamp);

    std::vector<std::string> getNetStatHeaders();
};

#endif // NETSTAT_H
