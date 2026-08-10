@echo off
cd /d "%~dp0"
start "APGS Product Card" http://127.0.0.1:4173
npm run dev -- --host 127.0.0.1 --port 4173
