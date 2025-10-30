@echo off
echo Starting Car Gallery Project...
echo.
echo 1. Starting Backend Server (Port 4000)...
cd /d "A:\AWS projects\car-gallery-aws\Backend"
start "Backend Server" cmd /k "node server-dev.js"

echo.
echo 2. Starting Frontend Server (Port 3000)...
cd /d "A:\AWS projects\car-gallery-aws\Frontend" 
start "Frontend Server" cmd /k "python -m http.server 3000"

echo.
echo 3. Opening Browser...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo Project started successfully!
echo Backend API: http://localhost:4000/api
echo Frontend: http://localhost:3000
echo.
pause