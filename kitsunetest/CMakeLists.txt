cmake_minimum_required(VERSION 3.10)

# プロジェクト名とC++の標準バージョンを設定
project(FeatureExtractorTest LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)


# 実行ファイルを生成
add_executable(test_feature_extractor main.cpp FeatureExtractor.cpp NetStat.cpp AfterImage.cpp)


