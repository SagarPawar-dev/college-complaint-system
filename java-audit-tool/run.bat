@echo off
title College Complaint System - Java Admin Audit Tool
cd /d "%~dp0"

echo ============================================================
echo   College Complaint System - Java 21 Admin Audit Console   
echo ============================================================
echo.

:: Check if java is accessible in PATH
where java >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Using Java from PATH...
    java ComplaintAuditTool.java
) else (
    :: Fallback to installed Eclipse Adoptium JDK path
    if exist "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin\java.exe" (
        echo [INFO] Using installed JDK 21...
        "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin\java.exe" ComplaintAuditTool.java
    ) else (
        echo [ERROR] Java could not be found. Please ensure JDK 21 is installed.
    )
)

echo.
echo ============================================================
echo   Session finished. Press any key to exit.
echo ============================================================
pause >nul
