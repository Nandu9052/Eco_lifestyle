# Eco Lifestyle Agent - Startup Script for PowerShell
# Launches both FastAPI Backend and Vite Frontend in separate windows

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "==========================================" -ForegroundColor Green
Write-Host " ECO LIFESTYLE AGENT - STARTUP" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Project directory: $ProjectDir" -ForegroundColor Gray

# 1. Resolve Python executable
$pythonExe = "python"
if (Test-Path "$ProjectDir\backend\.venv\Scripts\python.exe") {
    $pythonExe = "$ProjectDir\backend\.venv\Scripts\python.exe"
} elseif (Test-Path "$ProjectDir\..\.venv\Scripts\python.exe") {
    $pythonExe = (Resolve-Path "$ProjectDir\..\.venv\Scripts\python.exe").Path
}

Write-Host "Using Python: $pythonExe" -ForegroundColor Cyan

# 2. Launch Backend in a new window
Write-Host "Launching Backend (FastAPI on http://127.0.0.1:8000)..." -ForegroundColor Yellow
$backendCmd = "cd '$ProjectDir\backend'; Write-Host 'Eco Lifestyle Agent - Backend API' -ForegroundColor Green; Write-Host 'Docs available at: http://127.0.0.1:8000/docs' -ForegroundColor Cyan; & '$pythonExe' -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 3. Launch Frontend in a new window
Write-Host "Launching Frontend (Vite on http://localhost:5173)..." -ForegroundColor Yellow
$frontendCmd = "cd '$ProjectDir\frontend'; Write-Host 'Eco Lifestyle Agent - Frontend' -ForegroundColor Cyan; npm run dev -- --host 127.0.0.1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

# 4. Display URLs
Write-Host "`nBoth services launched in separate windows!" -ForegroundColor Green
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host " Web Application: " -NoNewline; Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host " Backend API:     " -NoNewline; Write-Host "http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host " Interactive Docs:" -NoNewline; Write-Host "http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Gray
Write-Host "To stop the servers, close the opened PowerShell windows." -ForegroundColor Gray

# Optional: Prompt to open browser
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
