cmake_minimum_required(VERSION 3.10)
project(KitsuneTB LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# HLS テストベンチ (ソフトウェアシミュレーション用)
# __SYNTHESIS__ は定義しない → std::pow / std::sqrt を使用
add_executable(kitsune_tb
    kitsune_tb.cpp
    kitsune_top.cpp
    ../AfterImage.cpp
    ../NetStat.cpp
)

target_include_directories(kitsune_tb PRIVATE ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/..)

if(MSVC)
    target_compile_options(kitsune_tb PRIVATE /W3 /O2)
else()
    target_compile_options(kitsune_tb PRIVATE -Wall -O2)
    target_link_libraries(kitsune_tb m)
endif()
