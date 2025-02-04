@echo off
REM Set MongoDB connection details
set DUMP_DIR=C:\backup\mongodump

REM Delete the existing dump directory files if they exist
if exist "%DUMP_DIR%" rmdir /s /q "%DUMP_DIR%"

REM Enable delayed expansion for variables with special characters
setlocal enabledelayedexpansion

REM Prompt the user for password using PowerShell
for /f "tokens=*" %%i in ('powershell -command "Read-Host -AsSecureString 'Enter password:' | ConvertFrom-SecureString -AsPlainText"') do set "MONGO_PASSWORD=%%i"

REM URL-encode the password using PowerShell
for /f "tokens=*" %%i in ('powershell -command "[uri]::EscapeDataString('%MONGO_PASSWORD%')"') do set "MONGO_PASSWORD_ENCODED=%%i"

REM Debug: Log the raw and encoded password (remove this in production)
echo Raw Password: %MONGO_PASSWORD%
echo Encoded Password: %MONGO_PASSWORD_ENCODED%

REM Create backup directory if it doesn't exist
if not exist "%DUMP_DIR%" mkdir "%DUMP_DIR%"

REM Set the MongoDB URI for Employee Profile
set ""

REM Debug: Log the URI (remove this in production)
echo MongoDB URI: "!MONGO_URI!"

REM Step 1: Run mongodump from remote MongoDB
echo Starting mongodump...
mongodump --uri "!MONGO_URI!" --out "%DUMP_DIR%"
if errorlevel 1 (
    echo mongodump failed!
    endlocal
    pause
    exit /b %errorlevel%
)
echo mongodump completed successfully.

REM Step 2: Dynamically get the folder name
for /d %%F in ("%DUMP_DIR%\*") do set "DUMP_SUBFOLDER=%%~nxF"

REM Debug: Log the dynamic folder name (remove this in production)
echo Found dump subfolder: %DUMP_SUBFOLDER%

REM Step 3: Run mongorestore to local MongoDB
echo Starting mongorestore...
mongorestore --db testEmployeeProfile "%DUMP_DIR%\%DUMP_SUBFOLDER%"
if errorlevel 1 (
    echo mongorestore failed!
    endlocal
    pause
    exit /b %errorlevel%
)
echo mongorestore completed successfully.

endlocal
echo Backup and restore process completed.
pause
