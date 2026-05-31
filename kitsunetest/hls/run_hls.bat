@echo off
REM ============================================================
REM run_hls.bat  --  Vitis HLS 合成バッチスクリプト
REM
REM 使い方:
REM   run_hls.bat          -- C 合成のみ
REM   run_hls.bat csim     -- C シミュレーション + 合成
REM   run_hls.bat cosim    -- C シミュレーション + 合成 + コシミュレーション
REM ============================================================

set XILINX_VITIS=C:\Xilinx\2025.1\Vitis
set VITIS_RUN=%XILINX_VITIS%\bin\vitis-run.bat

REM 環境変数のセットアップ
call %XILINX_VITIS%\settings64.bat >nul 2>&1

REM カレントディレクトリを hls/ に変更
cd /d "%~dp0"

if "%1"=="csim" (
    echo [INFO] Running C simulation + synthesis...
    call %VITIS_RUN% --mode hls --tcl run_hls_csim.tcl
) else if "%1"=="cosim" (
    echo [INFO] Running C simulation + synthesis + co-simulation...
    call %VITIS_RUN% --mode hls --tcl run_hls_cosim.tcl
) else (
    echo [INFO] Running C synthesis only...
    call %VITIS_RUN% --mode hls --tcl run_hls.tcl
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] HLS run failed with error %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)
echo [INFO] Done. Check kitsune_hls_proj\solution1\syn\report\ for synthesis report.
