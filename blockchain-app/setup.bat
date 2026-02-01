@echo off
REM Blockchain App - Quick Start Setup for Windows

color 0A
echo ========================================
echo   Blockchain App - Quick Start Setup
echo ========================================
echo.

REM Check Node.js
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo X Node.js is not installed
    echo   Please install from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
color 0A
echo OK Node.js %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo X npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo OK npm %NPM_VERSION%
echo.

REM Install backend
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo X Failed to install backend dependencies
    pause
    exit /b 1
)
color 0A
echo OK Backend dependencies installed
echo.

REM Install frontend
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo X Failed to install frontend dependencies
    pause
    exit /b 1
)
color 0A
echo OK Frontend dependencies installed
echo.

cd ..

REM Create .env
if not exist backend\.env (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env >nul
    color 0A
    echo OK .env created
    echo.
)

color 0A
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update MetaMask network settings
echo 2. Start backend:   cd backend ^&^& npm start
echo 3. Start frontend:  cd frontend ^&^& npm start
echo 4. Open http://localhost:3000
echo.
pause
