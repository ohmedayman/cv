@echo off
REM ============================================================
REM Cloud Call Center - Deployment Script (Windows)
REM ============================================================

echo.
echo ============================================
echo   Cloud Call Center - Setup Script
echo ============================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Download: https://www.docker.com/products/docker-desktop
    exit /b 1
)

REM Check if Docker Compose is available
docker compose version >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not available.
    exit /b 1
)

echo [1/6] Creating environment files...
if not exist "backend\.env" (
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/callcenter > backend\.env
    echo REDIS_URL=redis://localhost:6379 >> backend\.env
    echo JWT_SECRET=change-this-to-a-secure-random-string-in-production >> backend\.env
    echo ASTERISK_HOST=localhost >> backend\.env
    echo ASTERISK_PORT=8088 >> backend\.env
    echo ASTERISK_USER=admin >> backend\.env
    echo ASTERISK_PASSWORD=admin >> backend\.env
    echo ASTERISK_WS_HOST=wss://localhost:8089/ws >> backend\.env
    echo SIP_DOMAIN=192.168.1.100 >> backend\.env
    echo SIP_WS_SERVER=wss://192.168.1.100:8089/ws >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo PORT=3001 >> backend\.env
    echo CORD_ORIGIN=http://localhost:5173 >> backend\.env
    echo [OK] Backend .env created
)

if not exist "frontend\.env" (
    echo VITE_API_URL=http://localhost:3001/api > frontend\.env
    echo VITE_SIP_DOMAIN=192.168.1.100 >> frontend\.env
    echo VITE_SIP_WS_SERVER=wss://192.168.1.100:8089/ws >> frontend\.env
    echo VITE_SIP_PASSWORD=change-me >> frontend\.env
    echo [OK] Frontend .env created
)

echo.
echo [2/6] Starting Docker containers...
docker compose up -d postgres redis asterisk
echo [OK] Containers started

echo.
echo [3/6] Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [4/6] Setting up backend...
cd backend
call npm install
call npx prisma generate
call npx prisma db push
cd ..

echo.
echo [5/6] Setting up frontend...
cd frontend
call npm install
cd ..

echo.
echo [6/6] Starting development servers...
echo.
echo ============================================
echo   Development URLs:
echo   - Backend API:  http://localhost:3001
echo   - Frontend:     http://localhost:5173
echo   - FreePBX GUI:  http://localhost:8088
echo   - SIP WebSocket: wss://localhost:8089/ws
echo ============================================
echo.

REM Start both servers in parallel
start "Backend" cmd /k "cd backend && npm run dev"
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started!
echo.
echo Default login credentials:
echo   Email: admin@callcenter.com
echo   Password: password123
echo.
pause
