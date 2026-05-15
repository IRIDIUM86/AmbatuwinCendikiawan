# Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Quick analysis
python main.py

# Start API server
python api_server.py

# Test everything
python test_integration.py

# Try API examples
python example_client.py
```

## 📡 API Endpoints

```bash
# Health check
GET http://localhost:5000/api/health

# Get all booths
GET http://localhost:5000/api/events/all

# Get specific booth
GET http://localhost:5000/api/events/{id}

# Search (natural language)
POST http://localhost:5000/api/events/search
Body: {"query": "affordable booth under 500"}

# Chat
POST http://localhost:5000/api/chat
Body: {"message": "What booths are available?"}

# Parse preferences
POST http://localhost:5000/api/preferences/parse
Body: {"input": "I need a booth with parking"}
```

## 🔧 Configuration

**Model ID:** `global.anthropic.claude-sonnet-4-5-20250929-v1:0`  
**Table:** `bazaar_booths`  
**Region:** `ap-southeast-5`

Edit in: `config.py`

## ✅ System Status

- ✅ Supabase: Working
- ✅ AWS Bedrock: Working
- ✅ Database: 25 booths
- ✅ LLM: Claude Sonnet 4.5
- ✅ API: All endpoints operational

## 📝 Files to Know

| File | Purpose |
|------|---------|
| `main.py` | Quick booth analysis |
| `api_server.py` | REST API server |
| `config.py` | Configuration |
| `.env` | Credentials |
| `test_integration.py` | Full system test |

## 🐛 Troubleshooting

```bash
# Test database
python test_supabase_only.py

# Test LLM
python test_sonnet_45.py

# Test full system
python test_integration.py
```

## 📚 Documentation

- `FINAL_SUMMARY.md` - Complete guide
- `SUCCESS_SUMMARY.md` - Success details
- `README_BACKEND.md` - Technical docs
- `DEPLOYMENT_GUIDE.md` - Production deployment
