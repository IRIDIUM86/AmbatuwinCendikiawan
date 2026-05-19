# Food Vendor Event Matching System

## 🎯 What is This?

An AI-powered backend system that helps food vendors find suitable events (bazaars, festivals, markets) through natural language search and intelligent matching. Built with AWS Bedrock (Claude 3 Sonnet) and Supabase, with robust hallucination prevention.

## ⚡ Quick Start

**New to this project? Start here:**

1. **[📖 INDEX.md](INDEX.md)** - Complete documentation index (find anything!)
2. **[🚀 QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
3. **[📋 PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What was built

## 🎨 Key Features

- ✅ **Natural Language Search** - "I need a weekend bazaar in Jakarta under 3M"
- ✅ **Intelligent Matching** - AI-powered event filtering and ranking
- ✅ **Hallucination Prevention** - 5-layer validation ensures accuracy
- ✅ **Chatbot Interface** - Conversational assistance for vendors
- ✅ **REST API** - Easy frontend integration

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [INDEX.md](INDEX.md) | 📖 Find any documentation quickly |
| [QUICKSTART.md](QUICKSTART.md) | 🚀 Get started in 5 minutes |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 📋 Overview of what was built |
| [README_BACKEND.md](README_BACKEND.md) | 📖 Complete technical docs |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 🏗️ System design & architecture |
| [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) | 🔄 How the system works |
| [CONFIGURATION_CHECKLIST.md](CONFIGURATION_CHECKLIST.md) | ✅ Setup checklist |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | 🚀 Production deployment |

## 🏃 Quick Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Test Supabase connection first
python test_supabase_only.py

# Test the full system
python test_integration.py

# Start the API server
python api_server.py

# Try example API calls
python example_client.py
```

## ⚠️ Important: Supabase API Key

If you get an "Invalid API key" error, you need to get your real Supabase API key:

👉 **[Follow this guide: GET_SUPABASE_KEY.md](GET_SUPABASE_KEY.md)**

Quick summary:
1. Go to https://app.supabase.com
2. Select your project → Settings → API
3. Copy the **anon public** key (starts with `eyJ`)
4. Update `supabaseKey` in your `.env` file
5. Run `python test_supabase_only.py` to verify

## 📡 API Endpoints

- `POST /api/events/search` - Natural language event search
- `POST /api/chat` - Chatbot conversation
- `GET /api/events/all` - List all events
- `GET /api/events/<id>` - Get specific event
- `POST /api/preferences/parse` - Parse natural language to structured data

## 🔧 Technology Stack

- **Language**: Python 3.13
- **API**: Flask
- **LLM**: AWS Bedrock (Claude 3 Sonnet)
- **Database**: Supabase (PostgreSQL)

## 📦 Project Structure

```
├── Core Backend
│   ├── llm_service.py          # LLM integration
│   ├── database_service.py     # Database layer
│   ├── event_matcher.py        # Orchestration
│   └── api_server.py           # REST API
│
├── Testing & Examples
│   ├── test_integration.py     # Integration tests
│   └── example_client.py       # API examples
│
├── Documentation
│   ├── INDEX.md                # Documentation index
│   ├── QUICKSTART.md           # Quick start guide
│   ├── PROJECT_SUMMARY.md      # Project overview
│   ├── README_BACKEND.md       # Technical docs
│   ├── ARCHITECTURE.md         # System architecture
│   ├── WORKFLOW_GUIDE.md       # How it works
│   ├── CONFIGURATION_CHECKLIST.md  # Setup checklist
│   └── DEPLOYMENT_GUIDE.md     # Deployment guide
│
└── Configuration
    ├── requirements.txt        # Python dependencies
    ├── .env                    # Environment variables
    └── .gitignore             # Git ignore rules
```

## 🛡️ Hallucination Prevention

This system implements a **5-layer validation approach** to prevent AI hallucination:

1. **Structured Input** - Parse natural language to validated JSON
2. **Database Pre-filtering** - Use SQL to narrow candidates
3. **Context Grounding** - Send actual event data to LLM
4. **Output Validation** - Verify all LLM-returned IDs exist in database
5. **Data Enrichment** - Replace LLM data with database data (source of truth)

## 🎯 Use Cases

- "I need a weekend bazaar in Jakarta"
- "Show me affordable events under 2 million rupiah"
- "Large booth at high-traffic festival"
- "What events do you recommend for a dessert vendor?"

## 🚀 Next Steps

1. **Setup**: Follow [QUICKSTART.md](QUICKSTART.md)
2. **Understand**: Read [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)
3. **Integrate**: See [README_BACKEND.md](README_BACKEND.md)
4. **Deploy**: Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📞 Need Help?

- **Setup issues**: Check [QUICKSTART.md](QUICKSTART.md) → Troubleshooting
- **API questions**: See [README_BACKEND.md](README_BACKEND.md) → API Endpoints
- **Can't find something**: Use [INDEX.md](INDEX.md) to navigate

---

## Original Setup Notes

### Supabase Installation
In order to use Supabase, you have to install Supabase SDK first with the following command:
- Frontend: `npm install @supabase/supabase-js`
- Backend: `pip install supabase`

### Python Environment
For backend, due to pyiceberg cannot be installed with pip 3.14 somehow, we are going to use venv:
1. `py -3.13 -m venv venv`
2. `.\venv\Scripts\activate` must be run before doing anything to use py 3.13
3. `pip install supabase`

### Bedrock Installation
`pip install boto3`

---

**Built with focus on production readiness, clean architecture, and comprehensive documentation.** 🚀

**Status: Production Ready** ✅