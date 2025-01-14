@echo off
REM Set MongoDB connection details
set MONGO_HOST=localhost
set MONGO_PORT=27017
set MONGO_DB=mydatabase
set DUMP_DIR=C:\backup\mongodump
set RESTORE_DIR=C:\backup\mongorestore

REM Prompt the user for password using PowerShell
for /f "tokens=*" %%i in ('powershell -command "Read-Host -AsSecureString 'Enter password:' | ConvertFrom-SecureString -AsPlainText"') do set "MONGO_PASSWORD=%%i"

REM Create backup directory if it doesn't exist
if not exist %DUMP_DIR% mkdir %DUMP_DIR%

REM Step 1: Run mongodump
echo Starting mongodump...
mongodump --uri "mongodb+srv://reader:%MONGO_PASSWORD%@pustananaccounting.ewbqnuw.mongodb.net/pustananAccounting" --out %DUMP_DIR%
if %errorlevel% neq 0 (
    echo mongodump failed!
    pause
    exit /b %errorlevel%
)
echo mongodump completed successfully.

REM Step 2: Run mongorestore
echo Starting mongorestore...
mongorestore --db testAccounting %DUMP_DIR%/pustananAccounting
if %errorlevel% neq 0 (
    echo mongorestore failed!
    pause
    exit /b %errorlevel%
)
echo mongorestore completed successfully.

echo Backup and restore process completed.
pause
