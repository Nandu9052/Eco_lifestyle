@echo off
set "PROJECT_DIR=%~dp0"

echo ==========================================
echo  ECO LIFESTYLE AGENT - STARTUP
echo ==========================================

:: Resolve Python executable
set "PYTHON_EXE=python"
if exist "%PROJECT_DIR%backend\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_DIR%backend\.venv\Scripts\python.exe"
) else if exist "%PROJECT_DIR%..\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_DIR%..\.venv\Scripts\python.exe"
)

echo Starting Backend on http://127.0.0.1:8000 ...
start "Eco Lifestyle Agent - Backend" cmd /k "cd /d "%PROJECT_DIR%backend" && "%PYTHON_EXE%" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend on http://localhost:5173 ...
start "Eco Lifestyle Agent - Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm run dev -- --host 127.0.0.1"

echo.
echo ------------------------------------------
echo  Web Application:  http://localhost:5173
echo  Backend API:      http://127.0.0.1:8000
echo  API Documentation: http://127.0.0.1:8000/docs
echo ------------------------------------------
echo Close the two opened command windows when finished.