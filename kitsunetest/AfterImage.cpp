#include "AfterImage.h"
#include <cmath>
#include <iostream>

// ---------------- IncStat ----------------

IncStat::IncStat(double lambda, const std::string& id, double initTime, bool typeDiff)
    : Lambda(lambda), ID(id), lastTimestamp(initTime), isTypeDiff(typeDiff),
      CF1(0), CF2(0), weight(1e-20), lastValue(0),
      cachedMean(NAN), cachedVar(NAN), cachedStd(NAN), isCachedValid(false) {
}

void IncStat::insert(double value, double timestamp) {
    if (isTypeDiff) {
        double diff = timestamp - lastTimestamp;
        value = (diff > 0) ? diff : 0;
    }
    processDecay(timestamp);
    CF1 += value;
    CF2 += value * value;
    weight += 1;
    lastTimestamp = timestamp;
    lastValue = value; // 🔑 保存
    isCachedValid = false;
}

void IncStat::processDecay(double timestamp) {
    double timeDiff = timestamp - lastTimestamp;
    if (timeDiff > 0) {
        double factor = std::pow(2.0, -Lambda * timeDiff);
        CF1 *= factor;
        CF2 *= factor;
        weight *= factor;
        lastTimestamp = timestamp;
    }
}

double IncStat::mean() const {
    if (!isCachedValid) {
        cachedMean = CF1 / weight;
        cachedVar = std::abs(CF2 / weight - cachedMean * cachedMean);
        cachedStd = std::sqrt(cachedVar);
        isCachedValid = true;
    }
    return cachedMean;
}

double IncStat::variance() const { if (!isCachedValid) mean(); return cachedVar; }
double IncStat::stdDev() const { if (!isCachedValid) mean(); return cachedStd; }
double IncStat::getWeight() const { return weight; }
double IncStat::getLastValue() const { return lastValue; } // 🔑 追加
std::string IncStat::getID() const { return ID; }

std::vector<double> IncStat::getStats1D() const {
    return { weight, mean(), variance() };
}

std::vector<std::string> IncStat::getHeaders1D(bool includeID) const {
    std::vector<std::string> headers = { "weight", "mean", "stdDev" };
    if (includeID) {
        for (auto& h : headers) { h += "_" + ID; }
    }
    return headers;
}

// ---------------- IncStatCov ----------------

IncStatCov::IncStatCov(IncStat* s1, IncStat* s2, double initTime)
    : stat1(s1), stat2(s2), CF3(0), weight(1e-20),
      lastTimestamp(initTime), lastRes1(0), lastRes2(0) {
}

// AfterImage.cpp
void IncStatCov::updateCov(const std::string& ID, double value, double timestamp) {
    int inc;
    if (ID == stat1->getID()) {
        inc = 0;
    } else if (ID == stat2->getID()) {
        inc = 1;
    } else {
        std::cerr << "updateCov ID error: " << ID << std::endl;
        return;
    }

    if (inc == 0) {
        stat2->processDecay(timestamp);
    } else {
        stat1->processDecay(timestamp);
    }
    processDecay(timestamp, inc);

    double res = value - (inc == 0 ? stat1->mean() : stat2->mean());
    double resid = res * (inc == 0 ? lastRes2 : lastRes1);
    CF3 += resid;
    weight += 1;

    if (inc == 0) {
        lastRes1 = res;
    } else {
        lastRes2 = res;
    }
}


void IncStatCov::processDecay(double timestamp, int inc) {
    double timeDiff = timestamp - lastTimestamp;
    if (timeDiff > 0) {
        double factor = std::pow(2.0, -stat1->getLambda() * timeDiff);
        CF3 *= factor;
        weight *= factor;
        // Python と同様に、更新した側 (inc) の lastRes のみ decay する
        if (inc == 0) {
            lastRes1 *= factor;
        } else {
            lastRes2 *= factor;
        }
        lastTimestamp = timestamp;
    }
}

double IncStatCov::radius(const std::vector<IncStat*>& otherStats) const {
    double A = stat1->variance() * stat1->variance();
    for (const auto& stat : otherStats) {
        A += stat->variance() * stat->variance();
    }
    return std::sqrt(A);
}

double IncStatCov::magnitude(const std::vector<IncStat*>& otherStats) const {
    double A = std::pow(stat1->mean(), 2);
    for (const auto& stat : otherStats) {
        A += std::pow(stat->mean(), 2);
    }
    return std::sqrt(A);
}

double IncStatCov::getCovariance() const { return CF3 / weight; }
double IncStatCov::getPCC() const {
    double std1 = stat1->stdDev(), std2 = stat2->stdDev();
    return (std1 > 0 && std2 > 0) ? (getCovariance() / (std1 * std2)) : 0;
}

std::vector<double> IncStatCov::get2DStatsOnly() const {
    return {
        radius({stat2}),
        magnitude({stat2}),
        getCovariance(),
        getPCC()
    };
}

std::vector<double> IncStatCov::getStats2D() const {
    auto s1D = stat1->getStats1D();
    auto s2D = get2DStatsOnly();
    s1D.insert(s1D.end(), s2D.begin(), s2D.end());
    return s1D;
}

std::vector<std::string> IncStatCov::getHeaders2D(bool includeID) const {
    std::string s1 = includeID ? stat1->getID() : "0";
    std::string s2 = includeID ? stat2->getID() : "1";
    return {
        "weight_" + s1,
        "mean_" + s1,
        "std_" + s1,
        "radius_" + s1 + "_" + s2,
        "magnitude_" + s1 + "_" + s2,
        "covariance_" + s1 + "_" + s2,
        "pcc_" + s1 + "_" + s2
    };
}

// ---------------- IncStatDB ----------------

IncStatDB::IncStatDB(double lambda) : defaultLambda(lambda) {}

std::shared_ptr<IncStat> IncStatDB::registerStream(const std::string& id, double lambda, double initTime, bool isTypeDiff) {
    std::string key = id + "_" + std::to_string(lambda);
    if (stats.find(key) == stats.end()) {
        stats[key] = std::make_shared<IncStat>(lambda, id, initTime, isTypeDiff);
    }
    return stats[key];
}

std::shared_ptr<IncStatCov> IncStatDB::registerCov(const std::string& id1, const std::string& id2, double lambda, double initTime) {
    // Python では cov(A,B) と cov(B,A) は同一オブジェクト。
    // どちらの順序でも見つかるように両方向のキーを確認する。
    std::string key    = id1 + "_" + id2 + "_" + std::to_string(lambda);
    std::string keyRev = id2 + "_" + id1 + "_" + std::to_string(lambda);

    auto it = covs.find(key);
    if (it != covs.end()) return it->second;
    it = covs.find(keyRev);
    if (it != covs.end()) return it->second;

    auto stat1 = registerStream(id1, lambda, initTime);
    auto stat2 = registerStream(id2, lambda, initTime);
    auto cov = std::make_shared<IncStatCov>(stat1.get(), stat2.get(), initTime);
    covs[key] = cov;
    return cov;
}

std::vector<double> IncStatDB::update_get_1D_Stats(
    const std::string& ID, double timestamp, double value, double lambda, bool isTypeDiff) {
    auto stat = registerStream(ID, lambda, timestamp, isTypeDiff);
    stat->insert(value, timestamp);
    return stat->getStats1D();
}

std::vector<double> IncStatDB::update_get_1D2D_Stats(
    const std::string& ID1,
    const std::string& ID2,
    double timestamp,
    double value,
    double lambda)
{
    // Python の動作を再現:
    // 1) update_get_1D_Stats(ID1) → ID1 ストリームを更新して 1D 統計を取得
    // 2) update_get_2D_Stats(ID1, ID2) → cov を更新して 2D 統計を取得
    // Python では incStat.insert() が登録済みの cov を自動更新するため、
    // cov が既存の場合は updateCov が 2 回呼ばれる（insert 内 + 明示的呼び出し）。

    // 双方向どちらのキーでも cov の存在確認
    std::string covKey    = ID1 + "_" + ID2 + "_" + std::to_string(lambda);
    std::string covKeyRev = ID2 + "_" + ID1 + "_" + std::to_string(lambda);
    bool covAlreadyExists = (covs.count(covKey) > 0 || covs.count(covKeyRev) > 0);

    // 1D: ID1 ストリームを更新（Python の update_get_1D_Stats 相当）
    auto stats1D = update_get_1D_Stats(ID1, timestamp, value, lambda, false);

    // 2D: cov を取得（双方向対応、なければ作成）
    auto covStat = registerCov(ID1, ID2, lambda, timestamp);

    // Python の insert() 内での自動伝播を模倣（2 パケット目以降）
    if (covAlreadyExists) {
        covStat->updateCov(ID1, value, timestamp);
    }
    // 明示的な update_get_2D_Stats 相当の更新
    covStat->updateCov(ID1, value, timestamp);

    // Python: [w(ID1), mean(ID1), var(ID1), radius, magnitude, cov, pcc]
    auto stats2D = covStat->get2DStatsOnly();
    stats1D.insert(stats1D.end(), stats2D.begin(), stats2D.end());
    return stats1D;
}


std::vector<double> IncStatDB::getNDStats(const std::vector<std::string>& ids) const {
    double radius = 0.0, magnitude = 0.0;
    for (const auto& id : ids) {
        std::string key = id + "_" + std::to_string(defaultLambda);
        auto it = stats.find(key);
        if (it != stats.end()) {
            auto stat = it->second;
            radius += stat->variance();
            magnitude += std::pow(stat->mean(), 2);
        }
    }
    return { std::sqrt(radius), std::sqrt(magnitude) };
}

std::vector<std::string> IncStatDB::getHeadersND(const std::vector<std::string>& ids) const {
    std::string combinedID;
    for (size_t i = 0; i < ids.size(); ++i) {
        combinedID += ids[i];
        if (i < ids.size() - 1) combinedID += "_";
    }
    return { "radius_" + combinedID, "magnitude_" + combinedID };
}

size_t IncStatDB::cleanOutOldRecords(double cutoffWeight, double curTime) {
    size_t removedCount = 0;
    for (auto it = stats.begin(); it != stats.end();) {
        it->second->processDecay(curTime);
        if (it->second->getWeight() <= cutoffWeight) {
            it = stats.erase(it);
            removedCount++;
        } else {
            ++it;
        }
    }
    return removedCount;
}

std::vector<double> IncStatDB::getAllStats1D() const {
    std::vector<double> allStats;
    for (const auto& [key, stat] : stats) {
        auto stats1D = stat->getStats1D();
        allStats.insert(allStats.end(), stats1D.begin(), stats1D.end());
    }
    return allStats;
}

std::vector<double> IncStatDB::getAllStats2D() const {
    std::vector<double> allStats;
    for (const auto& [key, cov] : covs) {
        auto stats2D = cov->getStats2D();
        allStats.insert(allStats.end(), stats2D.begin(), stats2D.end());
    }
    return allStats;
}

std::vector<std::string> IncStatDB::getAllHeaders1D() const {
    std::vector<std::string> allHeaders;
    for (const auto& [key, stat] : stats) {
        auto headers = stat->getHeaders1D();
        allHeaders.insert(allHeaders.end(), headers.begin(), headers.end());
    }
    return allHeaders;
}

std::vector<std::string> IncStatDB::getAllHeaders2D() const {
    std::vector<std::string> allHeaders;
    for (const auto& [key, cov] : covs) {
        auto headers = cov->getHeaders2D();
        allHeaders.insert(allHeaders.end(), headers.begin(), headers.end());
    }
    return allHeaders;
}
