@echo off
echo ==============================================
echo      Starting Sengodai Blood Network App
echo ==============================================

echo Starting Backend Database Connection...
start cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak > NUL

echo Starting Frontend Website...
start cmd /k "cd frontend && npm run dev"

echo.
echo Opening Website in your Browser...
timeout /t 3 /nobreak > NUL
start http://localhost:5173

echo.
echo IMPORTANT: Leave the two black terminal windows open!
echo You can now test the app completely.
pause
