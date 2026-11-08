@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Nhap Canvas Khoi Dau Moi Vao Studio

echo ====================================================================
echo        NHAP CANVAS "KHOI DAU MOI" VAO SEECUT STUDIO
echo ====================================================================

if exist "..\data\studio.db" (
    cd ..
)

node "%~dp0import_canvas.js"
if %errorlevel% neq 0 (
    python "%~dp0import_canvas.py"
)

echo.
echo Hoan tat! Mo trinh duyet...
start "" http://localhost:3210/canvas/prj_06d6f1c9496a
pause
