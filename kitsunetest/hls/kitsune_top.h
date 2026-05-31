#pragma once
// ============================================================
// kitsune_top.h  -- HLS トップ関数宣言
// ============================================================
#include "kitsune_types.h"

// 1パケット分の特徴量を更新・出力する HLS トップ関数
// features[100] に結果を書き込む
void kitsune_update(const PacketInfo& pkt, double features[FEAT_TOTAL]);
