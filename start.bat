@echo off
title Cloud Call Center - Starting...
color 0A

echo.
echo  ============================================
echo    Cloud Call Center - Startup Script
echo  ============================================
echo.

echo [1/3] Starting Backend Server...
cd /d "E:\call center\cloud-callcenter\backend"
start "Backend Server" cmd /k "title Backend Server && npm run dev"

echo [2/3] Starting Frontend...
cd /d "E:\call center\cloud-callcenter\frontend"
start "Frontend" cmd /k "title Frontend && npm run dev"

echo [3/3] Done!
echo.
echo  ============================================
echo    URLs:
echo    Backend:  http://localhost:3001
echo    Frontend: http://localhost:5173
echo  ============================================
echo.
echo  Login Credentials:
echo  Email: admin@callcenter.com
echo  Password: password123
echo  ============================================
echo.
timeout /t 3
