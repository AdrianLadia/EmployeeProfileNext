@echo off
REM Set MongoDB connection details
set DUMP_DIR=C:\backup\mongodump

REM Prompt the user for password using PowerShell
for /f "tokens=*" %%i in ('powershell -command "Read-Host -AsSecureString 'Enter password:' | ConvertFrom-SecureString -AsPlainText"') do set "MONGO_PASSWORD=%%i"

REM Function to URL-encode a string
setlocal enabledelayedexpansion
set encodedPassword=
for %%i in (%MONGO_PASSWORD%) do (
    set ch=%%i
    for %%A in (!ch!) do (
        set "encodedPassword=!encodedPassword!%%~A"
    )
)
set "MONGO_PASSWORD_ENCODED=%encodedPassword%"
endlocal & set "MONGO_PASSWORD_ENCODED=%encodedPassword%"

REM Create backup directory if it doesn't exist
if not exist %DUMP_DIR% mkdir %DUMP_DIR%

REM Step 1: Run mongodump from remote MongoDB
echo Starting mongodump...
mongodump --uri "mongodb+srv://reader:%MONGO_PASSWORD_ENCODED%@pustananaccounting.ewbqnuw.mongodb.net/pustananAccounting" --out %DUMP_DIR%
if %errorlevel% neq 0 (
    echo mongodump failed!
    pause
    exit /b %errorlevel%
)
echo mongodump completed successfully.

REM Step 2: Run mongorestore to local MongoDB
echo Starting mongorestore...
mongorestore --db testaccounting %DUMP_DIR%/pustananAccounting
if %errorlevel% neq 0 (
    echo mongorestore failed!
    pause
    exit /b %errorlevel%
)
echo mongorestore completed successfully.

echo Backup and restore process completed.
pause