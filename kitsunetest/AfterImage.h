#ifndef AFTERIMAGE_H
#define AFTERIMAGE_H

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>

class IncStat {
private:
    std::string ID;
    double CF1, CF2, weight, Lambda, lastTimestamp;
    double lastValue; // 🔑 追加：最後に挿入された値
    bool isTypeDiff;

    mutable double cachedMean, cachedVar, cachedStd;
    mutable bool isCachedValid;

public:
    IncStat(double lambda, const std::string& id, double initTime = 0, bool typeDiff = false);

    void insert(double value, double timestamp);
    void processDecay(double timestamp);
    double mean() const;
    double variance() const;
    double stdDev() const;
    double getWeight() const;
    double getLastValue() const; // 🔑 追加
    std::string getID() const;
    double getLambda() const { return Lambda; }

    std::vector<double> getStats1D() const;
    std::vector<std::string> getHeaders1D(bool includeID = true) const;
};


class IncStatCov {
private:
    double CF3, weight, lastTimestamp, lastRes1, lastRes2;

public:
    IncStat* stat1;
    IncStat* stat2;

    IncStatCov(IncStat* s1, IncStat* s2, double initTime);

    void updateCov(const std::string& ID, double value, double timestamp);

    void processDecay(double timestamp, int inc);

    double radius(const std::vector<IncStat*>& otherStats) const;
    double magnitude(const std::vector<IncStat*>& otherStats) const;
    double getCovariance() const;
    double getPCC() const;

    std::vector<double> getStats2D() const;        // 7要素 (1D+2D) - 後方互換用
    std::vector<double> get2DStatsOnly() const;    // 4要素 (radius, magnitude, cov, pcc)
    std::vector<std::string> getHeaders2D(bool includeID = true) const;
};


class IncStatDB {
private:
    std::unordered_map<std::string, std::shared_ptr<IncStat>> stats;
    std::unordered_map<std::string, std::shared_ptr<IncStatCov>> covs; // key: "ID1_ID2_lambda"
    double defaultLambda;

public:
    IncStatDB(double lambda);

    std::shared_ptr<IncStat> registerStream(const std::string& id, double lambda, double initTime, bool isTypeDiff = false);
    std::shared_ptr<IncStatCov> registerCov(const std::string& id1, const std::string& id2, double lambda, double initTime);

    std::vector<double> update_get_1D_Stats(
        const std::string& ID, double timestamp, double value, double lambda, bool isTypeDiff = false);

    // IncStatDB クラス内
    std::vector<double> update_get_1D2D_Stats(
        const std::string& ID1,
        const std::string& ID2,
        double timestamp,
        double value,
        double lambda);


    std::vector<double> getNDStats(const std::vector<std::string>& ids) const;
    std::vector<std::string> getHeadersND(const std::vector<std::string>& ids) const;

    size_t cleanOutOldRecords(double cutoffWeight, double curTime);

    std::vector<double> getAllStats1D() const;
    std::vector<double> getAllStats2D() const;
    std::vector<std::string> getAllHeaders1D() const;
    std::vector<std::string> getAllHeaders2D() const;
};

#endif // AFTERIMAGE_H
