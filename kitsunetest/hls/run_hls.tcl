# ============================================================
# run_hls.tcl  --  Vitis HLS 合成スクリプト (2025.1 対応)
#
# 実行方法:
#   vitis-run --mode hls --tcl run_hls.tcl [--csim] [--cosim]
# または run_hls.bat を使う。
# ============================================================

# ---- プロジェクトを新規作成 (存在する場合はリセット) --------
open_project -reset kitsune_hls_proj

# ---- トップ関数の指定 ----------------------------------------
set_top kitsune_update

# ---- ソースファイル (合成対象) --------------------------------
# -std=c++17 は Vitis 内部 MinGW 8.3.0 と非互換のため省略
# kitsune_top.cpp は C++11/14 の機能のみ使用
add_files kitsune_top.cpp -cflags "-I."

# ---- テストベンチファイル (合成対象外) -----------------------
# テストベンチは AfterImage.cpp が構造化束縛 (C++17) を使うため std=c++17 が必要
# ただし csim_design / cosim_design 実行時のみコンパイルされる
add_files -tb kitsune_tb.cpp -cflags "-std=c++17 -I. -I.."
add_files -tb ../AfterImage.cpp -cflags "-std=c++17"
add_files -tb ../NetStat.cpp -cflags "-std=c++17"

# ---- TSV テストデータ (C シミュレーション用) -----------------
# kitsune_tb.exe がデフォルトで "../mirai_pcap/mirai.pcap.tsv" を開くため
# プロジェクトディレクトリから相対パスで参照される

# ---- ソリューション設定 --------------------------------------
open_solution -reset solution1

# ターゲットパーツ: Zynq UltraScale+ MPSoC ZCU104
set_part xczu7ev-ffvc1156-2-e

# クロック: 10 ns = 100 MHz
#   double 演算を含むため 5 ns (200 MHz) は厳しい
create_clock -period 10 -name default

# ---- HLS 最適化設定 ------------------------------------------
# パイプライン自動推定を許可
config_compile -pipeline_loops 0

# ---- C シミュレーション (--csim フラグで実行) ----------------
# csim_design -argv {"../mirai_pcap/mirai.pcap.tsv" "100"}

# ---- C 合成 --------------------------------------------------
csynth_design

# ---- Co-simulation (--cosim フラグで実行) --------------------
# cosim_design -argv {"../mirai_pcap/mirai.pcap.tsv" "100"}

# ---- IP エクスポート ------------------------------------------
export_design -format ip_catalog -output kitsune_ip -display_name "Kitsune AfterImage" -version 1.0

exit
