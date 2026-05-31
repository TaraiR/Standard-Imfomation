#include "FeatureExtractor.h"
#include <iostream>
#include <sstream>
#include <cstdlib>
#include <stdexcept>
#include <filesystem>

FeatureExtractor::FeatureExtractor(const std::string& filePath, size_t limit)
    : filePath(filePath), limit(limit), curPacketIndex(0), parseType(""), tsharkPath(getTsharkPath()) {
    initialize();
}

FeatureExtractor::~FeatureExtractor() {
    if (tsvStream.is_open()) {
        tsvStream.close();
    }
}

void FeatureExtractor::initialize() {
    // �t�@�C���̑��݊m�F
    if (!std::filesystem::exists(filePath)) {
        throw std::runtime_error("File not found: " + filePath);
    }

    // �t�@�C���^�C�v�̊m�F
    std::string fileExtension = filePath.substr(filePath.find_last_of(".") + 1);
    if (fileExtension == "tsv") {
        parseType = "tsv";
        openTsvFile();
    }
    else if (fileExtension == "pcap" || fileExtension == "pcapng") {
        if (!tsharkPath.empty()) {
            parseWithTshark();
            filePath += ".tsv";
            parseType = "tsv";
            openTsvFile();
        }
        else {
            throw std::runtime_error("Tshark not found. Scapy-based parsing is not implemented.");
        }
    }
    else {
        throw std::runtime_error("Unsupported file type: " + fileExtension);
    }

    // NetStat ������
    nstat = std::make_unique<NetStat>();
}

void FeatureExtractor::parseWithTshark() {
    std::cout << "Parsing with tshark..." << std::endl;
    std::string fields = "-e frame.time_epoch -e frame.len -e eth.src -e eth.dst -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e udp.srcport -e udp.dstport -e icmp.type -e icmp.code -e arp.opcode -e arp.src.hw_mac -e arp.src.proto_ipv4 -e arp.dst.hw_mac -e arp.dst.proto_ipv4 -e ipv6.src -e ipv6.dst";
    std::string cmd = "\"" + tsharkPath + "\" -r " + filePath + " -T fields " + fields + " -E header=y -E occurrence=f > " + filePath + ".tsv";
    if (std::system(cmd.c_str()) != 0) {
        throw std::runtime_error("Failed to parse PCAP file with tshark.");
    }
    std::cout << "Tshark parsing complete. File saved as: " << filePath + ".tsv" << std::endl;
}

std::string FeatureExtractor::getTsharkPath() {
    const char* envPath = std::getenv("PATH");
    if (!envPath) return "";

    // OS ごとにファイル名を動的に設定
#ifdef _WIN32
    std::string executable = "tshark.exe";
    char delimiter = ';';
#else
    std::string executable = "tshark";
    char delimiter = ':';
#endif

    std::istringstream pathStream(envPath);
    std::string path;
    while (std::getline(pathStream, path, delimiter)) {
        std::filesystem::path candidate = std::filesystem::path(path) / executable;
        if (std::filesystem::exists(candidate)) {
            return candidate.string();
        }
    }
    return "";
}


void FeatureExtractor::openTsvFile() {
    tsvStream.open(filePath);
    if (!tsvStream.is_open()) {
        throw std::runtime_error("Failed to open TSV file: " + filePath);
    }
    std::string headerLine;
    std::getline(tsvStream, headerLine);
    std::istringstream headerStream(headerLine);
    std::string column;
    while (std::getline(headerStream, column, '\t')) {
        tsvHeader.push_back(column);
    }
}

bool FeatureExtractor::parseTsvRow(std::vector<std::string>& row) {
    std::string line;
    if (!std::getline(tsvStream, line)) {
        return false; // EOF または読み取りエラー
    }
    std::istringstream lineStream(line);
    row.clear();
    std::string cell;
    while (std::getline(lineStream, cell, '\t')) {
        row.push_back(cell);
    }
    return true;
}

std::vector<double> FeatureExtractor::getNextVector() {
    if (curPacketIndex >= limit) {
        if (tsvStream.is_open()) tsvStream.close();
        return {};
    }

    std::vector<std::string> row;
    if (!parseTsvRow(row)) {
        if (tsvStream.is_open()) tsvStream.close();
        return {};
    }
    curPacketIndex++;

    double timestamp = std::stod(row[0]);
    double frameLen = std::stod(row[1]);
    std::string srcMAC = row[2];
    std::string dstMAC = row[3];
    std::string srcIP = row[4];
    std::string dstIP = row[5];
    std::string srcProtocol = row[6] + row[8]; // TCP port + UDP port (one will be empty)
    std::string dstProtocol = row[7] + row[9];

    int IPtype = -1;
    if (!srcIP.empty()) {          // IPv4
        IPtype = 0;
    } else if (!row[17].empty()) { // IPv6
        srcIP = row[17];
        dstIP = row[18];
        IPtype = 1;
    }

    // L2/L1 プロトコルの判定（Python の get_next_vector に対応）
    if (srcProtocol.empty()) {
        if (!row[12].empty()) {    // ARP
            srcProtocol = "arp";
            dstProtocol = "arp";
            srcIP = row[14];       // arp.src.proto_ipv4
            dstIP = row[16];       // arp.dst.proto_ipv4
            IPtype = 0;
        } else if (!row[10].empty()) { // ICMP
            srcProtocol = "icmp";
            dstProtocol = "icmp";
            IPtype = 0;
        } else if (srcIP.empty() && dstIP.empty()) { // その他 L2
            srcIP = row[2];        // src MAC で代替
            dstIP = row[3];
        }
    }

    return nstat->updateGetStats(IPtype, srcMAC, dstMAC, srcIP, srcProtocol, dstIP, dstProtocol, frameLen, timestamp);
}

size_t FeatureExtractor::getNumFeatures() const {
    return nstat->getNetStatHeaders().size();
}
