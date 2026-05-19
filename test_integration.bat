@echo off
echo ========================================
echo Backend-Frontend Integration Test
echo ========================================
echo.

echo [1/5] Testing Backend Health...
curl -s http://localhost:5000/api/health
echo.
echo.

echo [2/5] Testing Get All Events...
curl -s http://localhost:5000/api/events/all
echo.
echo.

echo [3/5] Testing Chat Endpoint...
curl -s -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello, what events do you have?\"}"
echo.
echo.

echo [4/5] Testing Event Search...
curl -s -X POST http://localhost:5000/api/events/search -H "Content-Type: application/json" -d "{\"query\": \"I need a tech event in Jakarta\"}"
echo.
echo.

echo [5/5] Testing Preferences Parse...
curl -s -X POST http://localhost:5000/api/preferences/parse -H "Content-Type: application/json" -d "{\"input\": \"I need a large booth at a weekend market\"}"
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
pause
