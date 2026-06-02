@echo off
:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Adding Windows Firewall rule for port 3001...
netsh advfirewall firewall delete rule name="Next.js Dev 3001" >nul 2>&1
netsh advfirewall firewall add rule name="Next.js Dev 3001" dir=in action=allow protocol=TCP localport=3001

echo.
echo Setting active network connection profile to Private...
powershell -Command "Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Private -ErrorAction SilentlyContinue"

echo.
echo ==========================================================
echo Success! Port 3001 is now open on your Wi-Fi network.
echo Your active Wi-Fi has been changed to a PRIVATE network.
echo ==========================================================
echo.
echo Try opening http://192.168.29.59:3001 on your phone now!
echo.
pause
