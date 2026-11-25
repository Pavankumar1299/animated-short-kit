@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo ========================================================
echo   Animated Shorts Kit - Video Renderer (Windows)
echo ========================================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo Error: Node.js is not found in PATH.
  echo Please install Node.js LTS from https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules\remotion (
  echo Installing dependencies (first run only)...
  call npm install
  if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

if not "%1"=="" (
  set VIDEO=%1
) else (
  echo Select video to render:
  echo   1) 04_speed_car (10s Short - Speed Car Hits A Tree)
  echo   2) 03_shopping_cart (10s Short - The Fake Shopper Secret)
  echo   3) 02_sliced_bread (60s Short - Otto Rohwedder Story)
  echo   4) 01_example (Sample project)
  echo   5) 05_postit_notes (30s Short - The Failed Glue)
  set /p VID_CHOICE="Enter 1, 2, 3, 4, or 5 (default 5): "
  if "!VID_CHOICE!"=="1" (
    set VIDEO=04_speed_car
  ) else if "!VID_CHOICE!"=="2" (
    set VIDEO=03_shopping_cart
  ) else if "!VID_CHOICE!"=="3" (
    set VIDEO=02_sliced_bread
  ) else if "!VID_CHOICE!"=="4" (
    set VIDEO=01_example
  ) else (
    set VIDEO=05_postit_notes
  )
)
echo Active Video: %VIDEO%
echo.
echo Running automated gates quality checks...
call npx tsx --tsconfig src/videos/%VIDEO%/tsconfig.json src/engine/check/gates.ts
if %errorlevel% neq 0 (
  echo.
  echo CHECKS FAILED! Please inspect errors above.
  pause
  exit /b 1
)

echo.
echo Select output resolution:
echo   1) Fast Preview (540x960)
echo   2) Full HD (1080x1920)
set /p RES_CHOICE="Enter 1 or 2 (default 1): "
if "%RES_CHOICE%"=="2" (
  set COMP=Video
  set SUF=full
) else (
  set COMP=Preview
  set SUF=preview
)

if not exist out mkdir out
set OUTFILE=out\%VIDEO%_%SUF%.mp4
echo.
echo Rendering %COMP% composition to %OUTFILE%...
set VIDEO=%VIDEO%
call npx remotion render src/index.ts %COMP% "%OUTFILE%" --codec h264 --gl=angle --concurrency=4

if %errorlevel% equ 0 (
  echo.
  echo ========================================================
  echo SUCCESS! Video saved to: %OUTFILE%
  echo ========================================================
  start explorer out
) else (
  echo.
  echo Render failed!
)

pause
