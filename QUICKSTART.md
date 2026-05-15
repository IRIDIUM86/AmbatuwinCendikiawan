# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt
```

### Step 2: Verify Environment Variables

Make sure your `.env` file contains:
```env
# Supabase
supabaseUrl=your_supabase_url
supabaseKey=your_supabase_key  # Must start with 'eyJ' (JWT format)

# AWS Bedrock
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-2
```

⚠️ **Important**: Your Supabase API key must be the real key from your dashboard!

**If you get "Invalid API key" error:**
👉 Follow the guide: **[GET_SUPABASE_KEY.md](GET_SUPABASE_KEY.md)**

Quick steps:
1. Go to https://app.supabase.com
2. Your project → Settings → API
3. Copy the **anon public** key (starts with `eyJ`)
4. Update `.env` file

### Step 3: Test Supabase Connection First

```bash
# Test Supabase connection
python test_supabase_only.py
```

Expected output:
```
✅ Supabase client created successfully!
✅ SUCCESS! Found X record(s)
✅ ALL TESTS PASSED!
```

If this fails, your Supabase key is incorrect. See [GET_SUPABASE_KEY.md](GET_SUPABASE_KEY.md).

### Step 4: Test the Full Integration

### Step 4: Test the Full Integration

```bash
# Run integration test to verify everything works
python test_integration.py
```

Expected output:
```
🔧 Initializing services...
✅ Services initialized

📊 Test 1: Fetching events from database...
✅ Found X events in database

🧠 Test 2: Parsing user preferences...
✅ Extracted preferences: {...}

🎯 Test 3: Finding matching events...
✅ Found X matching events

💬 Test 4: Testing chatbot...
✅ Chatbot response: ...

🎉 All tests completed successfully!
```

### Step 4: Start the API Server

```bash
# Start Flask server
python api_server.py
```

Server will run on `http://localhost:5000`

### Step 5: Test the API

Open a new terminal and run:

```bash
# Run example client
python example_client.py
```

## 📡 API Usage Examples

### Search for Events (Natural Language)

```bash
curl -X POST http://localhost:5000/api/events/search \
  -H "Content-Type: application/json" \
  -d '{"query": "I need a weekend bazaar in Jakarta under 3 million rupiah"}'
```

### Chat with Assistant

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What events do you have this weekend?",
    "conversation_history": []
  }'
```

### Get All Events

```bash
curl http://localhost:5000/api/events/all
```

### Parse Preferences

```bash
curl -X POST http://localhost:5000/api/preferences/parse \
  -H "Content-Type: application/json" \
  -d '{"input": "Large booth at weekend market under 5 million"}'
```

## 🔧 Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt
```

### "AWS Connection failed"
- Verify AWS credentials in `.env`
- Check IAM permissions for Bedrock access
- Ensure region is correct

### "Supabase connection error"
- Verify Supabase URL and key in `.env`
- Check table name in `database_service.py` (default: `bazaar_booths`)
- Ensure table exists in Supabase

### "Port already in use"
```bash
# Change port in api_server.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

## 📚 Next Steps

1. **Frontend Integration**: Use the API endpoints in your UI
2. **Customize Prompts**: Edit prompts in `llm_service.py` for your use case
3. **Add Features**: Extend with user authentication, caching, etc.
4. **Deploy**: Use Gunicorn for production deployment

## 🎯 Key Features

✅ **Natural Language Processing** - Parse vendor preferences from text  
✅ **Intelligent Matching** - AI-powered event filtering and ranking  
✅ **Hallucination Prevention** - All outputs validated against database  
✅ **Chatbot Interface** - Conversational assistance for vendors  
✅ **REST API** - Easy integration with any frontend  

## 📖 Documentation

- Full documentation: `README_BACKEND.md`
- API details: See "API Endpoints" section in README
- Architecture: See "Architecture" diagram in README

## 💡 Example Use Cases

1. **Vendor searches**: "I need a booth at a weekend market in Jakarta"
2. **Budget filtering**: "Show me events under 2 million rupiah"
3. **Conversational**: "What events do you recommend for a dessert vendor?"
4. **Specific requirements**: "Large booth at high-traffic festival next month"

## 🔐 Security Notes

- Never commit `.env` to version control
- Use environment variables for all secrets
- Configure CORS properly for production
- Add rate limiting for production use
- Use HTTPS in production

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review `README_BACKEND.md` for detailed documentation
3. Verify all environment variables are set correctly
