#ifndef FEATURE_EXTRACTOR_H
#define FEATURE_EXTRACTOR_H

#include "NetStat.h"
#include <string>
#include <vector>
#include <fstream>
#include <memory>

class FeatureExtractor {
private:
    std::string filePath;
    size_t limit;
    size_t curPacketIndex;
    std::unique_ptr<NetStat> nstat;
    std::ifstream tsvStream;
    std::vector<std::string> tsvHeader;
    std::string parseType;
    std::string tsharkPath;

    void initialize();
    void parseWithTshark();
    std::string getTsharkPath();
    void openTsvFile();
    bool parseTsvRow(std::vector<std::string>& row);

public:
    FeatureExtractor(const std::string& filePath, size_t limit = SIZE_MAX);
    ~FeatureExtractor();

    std::vector<double> getNextVector();
    size_t getNumFeatures() const;
};

#endif // FEATURE_EXTRACTOR_H
