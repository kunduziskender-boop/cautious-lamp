@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo Starting portfolio site locally...
echo A browser tab should open: http://127.0.0.1:9333/
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0open-site.ps1"
if errorlevel 1 exit /b %errorlevel%
