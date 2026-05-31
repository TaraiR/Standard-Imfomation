#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>
#include <string>
#include <chrono>
#include "FeatureExtractor.h"

int main() {
    std::cout << "Starting Feature Extractor Test..." << std::endl;

    std::string pcapFilePath = "./mirai_pcap/mirai.pcap";

    // FeatureExtractorの初期化（コンストラクタ使用）
    size_t maxPackets = 10; // 最大処理パケット数
    FeatureExtractor featureExtractor(pcapFilePath, maxPackets);

    std::cout << "FeatureExtractor initialized for " << pcapFilePath << std::endl;

    size_t packetCount = 0;         // 処理したパケット数
    double totalProcessingTime = 0.0; // 合計処理時間

    std::cout << "Extracting features (up to " << maxPackets << " packets)..." << std::endl;

    // パケットごとの特徴量を抽出
    while (packetCount < maxPackets) {
        try {
            auto startTime = std::chrono::high_resolution_clock::now(); // 処理開始時間の記録

            std::vector<double> features = featureExtractor.getNextVector();

            // 特徴量が空の場合は処理終了
            if (features.empty()) {
                std::cout << "No more packets to process." << std::endl;
                break;
            }

            auto endTime = std::chrono::high_resolution_clock::now(); // 処理終了時間の記録
            std::chrono::duration<double> elapsed = endTime - startTime;

            // パケット処理時間を計測
            double processingTime = elapsed.count();
            totalProcessingTime += processingTime;

            // 処理状況を出力
            packetCount++;
            // std::cout << "Packet " << packetCount << " processed in " << processingTime << " seconds." << std::endl;

            // 特徴量を出力（必要に応じてコメントアウト）
            std::cout << std::setprecision(15) << "Features: ";
            for (const auto& value : features) {
                std::cout << value << " ";
            }
            std::cout << std::endl;
        }
        catch (const std::exception& e) {
            std::cerr << "Error processing packet " << packetCount + 1 << ": " << e.what() << std::endl;
            break;
        }
    }

    // 処理結果を出力
    if (packetCount > 0) {
        double avgProcessingTime = totalProcessingTime / packetCount;
        std::cout << "Processed " << packetCount << " packets." << std::endl;
        std::cout << "Total processing time: " << totalProcessingTime << " seconds." << std::endl;
        std::cout << "Average time per packet: " << avgProcessingTime << " seconds." << std::endl;
    }
    else {
        std::cout << "No packets processed." << std::endl;
    }

    return 0;
}
