@echo off
echo ========================================
echo Food Vendor Booth Finder - Chatbot
echo ========================================
echo.
echo Starting backend API server...
echo.
echo The chatbot will open in your browser.
echo Keep this window open while using the chatbot.
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
echo.

start chatbot.html
python api_server.py
