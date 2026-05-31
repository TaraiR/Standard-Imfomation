# ============================================================
# run_hls_csim.tcl  --  C シミュレーション + C 合成
# ============================================================

open_project -reset kitsune_hls_proj
set_top kitsune_update

add_files kitsune_top.cpp -cflags "-I."

add_files -tb kitsune_tb.cpp -cflags "-std=c++17 -I. -I.."
add_files -tb ../AfterImage.cpp -cflags "-std=c++17"
add_files -tb ../NetStat.cpp -cflags "-std=c++17"

open_solution -reset solution1
set_part xczu7ev-ffvc1156-2-e
create_clock -period 10 -name default
config_compile -pipeline_loops 0

# C シミュレーション: 最初の 100 パケットで確認
csim_design -argv {"../mirai_pcap/mirai.pcap.tsv" "100"}

csynth_design

export_design -format ip_catalog -output kitsune_ip -display_name "Kitsune AfterImage" -version 1.0

exit
