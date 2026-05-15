# main.py vs Core Backend - Connection Explained

## 🎯 Quick Answer

**`main.py` is INDEPENDENT from the core backend files.**

It's a **standalone utility script** that directly uses:
- AWS Bedrock (via `boto3`)
- Supabase (via `requests`)
- Configuration (via `config.py`)

It does **NOT** use:
- `llm_service.py`
- `database_service.py`
- `event_matcher.py`
- `api_server.py`

---

## 📊 Visual Comparison

### Architecture 1: main.py (Standalone)
```
main.py
    ├─→ config.py (imports BEDROCK_MODEL_ID)
    ├─→ .env (loads credentials)
    ├─→ boto3 (direct AWS Bedrock calls)
    └─→ requests (direct Supabase HTTP calls)
```

### Architecture 2: Core Backend (Integrated System)
```
api_server.py
    ├─→ config.py
    ├─→ event_matcher.py
    │       ├─→ llm_service.py
    │       │       ├─→ boto3 (AWS Bedrock)
    │       │       └─→ config.py
    │       └─→ database_service.py
    │               ├─→ requests (Supabase)
    │               └─→ .env
    └─→ .env
```

---

## 🔍 Detailed Comparison

### main.py Structure
```python
import os
import json
import boto3
import requests
from dotenv import load_dotenv
from config import BEDROCK_MODEL_ID  # ← Only imports config

# Direct implementations (no service classes)
def fetch_booth_data():
    # Direct HTTP call to Supabase
    url = f"{supabase_url}/rest/v1/bazaar_booths?select=*"
    response = requests.get(url, headers=supabase_headers)
    return response.json()

def ask_bedrock(prompt_text):
    # Direct Bedrock API call
    response = bedrock.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        body=body
    )
    return response_body['content'][0]['text']

# Standalone execution
if __name__ == "__main__":
    data = fetch_booth_data()
    result = ask_bedrock(prompt)
    print(result)
```

### Core Backend Structure
```python
# api_server.py
from llm_service import BedrockLLMService      # ← Uses service classes
from database_service import DatabaseService
from event_matcher import EventMatcher
from config import BEDROCK_MODEL_ID

# Initialize services
llm_service = BedrockLLMService(...)
db_service = DatabaseService(...)
event_matcher = EventMatcher(llm_service, db_service)

# Use through orchestration layer
@app.route('/api/events/search', methods=['POST'])
def search_events():
    results = event_matcher.find_matching_events(query)
    return jsonify(results)
```

---

## 📋 File Dependencies

### main.py Dependencies
```
main.py
├── config.py ✅ (imports BEDROCK_MODEL_ID)
├── .env ✅ (loads credentials)
├── boto3 ✅ (AWS SDK)
├── requests ✅ (HTTP library)
└── python-dotenv ✅ (env loader)

Does NOT use:
❌ llm_service.py
❌ database_service.py
❌ event_matcher.py
❌ api_server.py
```

### api_server.py Dependencies
```
api_server.py
├── config.py ✅
├── .env ✅
├── llm_service.py ✅
├── database_service.py ✅
├── event_matcher.py ✅
├── flask ✅
└── flask-cors ✅

Does NOT use:
❌ main.py
```

---

## 🎯 Why Are They Separate?

### main.py Purpose
- **Quick analysis tool**
- **Standalone script**
- **Simple, direct implementation**
- **No API server needed**
- **Good for testing/debugging**

### Core Backend Purpose
- **Production API server**
- **Modular architecture**
- **Reusable service classes**
- **Scalable design**
- **Frontend integration**

---

## 🔄 How They Share Resources

### Shared Resources
Both use the same:
1. **config.py** - Model ID configuration
2. **.env** - Credentials
3. **AWS Bedrock** - Same model
4. **Supabase** - Same database

### Different Implementations
But they access them differently:

| Resource | main.py | Core Backend |
|----------|---------|--------------|
| **Bedrock** | Direct `boto3` calls | Through `llm_service.py` |
| **Supabase** | Direct `requests` calls | Through `database_service.py` |
| **Logic** | Inline functions | Through `event_matcher.py` |
| **Interface** | Command line | REST API via `api_server.py` |

---

## 📊 Code Flow Comparison

### main.py Flow
```
User runs: python main.py
    ↓
main.py starts
    ↓
Loads config.py (gets BEDROCK_MODEL_ID)
    ↓
Loads .env (gets credentials)
    ↓
fetch_booth_data() → Direct HTTP to Supabase
    ↓
ask_bedrock() → Direct boto3 to Bedrock
    ↓
Prints result to console
    ↓
Script ends
```

### Core Backend Flow
```
User runs: python api_server.py
    ↓
api_server.py starts
    ↓
Imports llm_service, database_service, event_matcher
    ↓
Initializes service classes
    ↓
Starts Flask server (waits for requests)
    ↓
User makes HTTP request to /api/events/search
    ↓
api_server.py → event_matcher.find_matching_events()
    ↓
event_matcher → llm_service.parse_user_preferences()
    ↓
event_matcher → database_service.fetch_events_by_criteria()
    ↓
event_matcher → llm_service.filter_events_with_llm()
    ↓
event_matcher → database_service.validate_event_ids()
    ↓
Returns JSON response to user
    ↓
Server continues running (handles more requests)
```

---

## 🎨 Visual Architecture

### main.py (Simple)
```
┌─────────────┐
│   main.py   │
│             │
│ ┌─────────┐ │
│ │ Direct  │ │
│ │ Bedrock │ │
│ │  Calls  │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │ Direct  │ │
│ │Supabase │ │
│ │  Calls  │ │
│ └─────────┘ │
└─────────────┘
      ↓
  Console Output
```

### Core Backend (Modular)
```
┌──────────────────────────────────────┐
│          api_server.py               │
│         (Flask REST API)             │
└────────────┬─────────────────────────┘
             │
┌────────────▼─────────────────────────┐
│       event_matcher.py               │
│      (Orchestration Layer)           │
└────┬──────────────────────┬──────────┘
     │                      │
┌────▼──────────┐    ┌─────▼──────────┐
│ llm_service.py│    │database_service│
│   (Bedrock)   │    │   (Supabase)   │
└───────────────┘    └────────────────┘
     ↓                      ↓
  AWS Bedrock          Supabase DB
```

---

## 🤔 When to Use Each?

### Use main.py When:
- ✅ Quick data analysis
- ✅ Testing Bedrock connection
- ✅ Debugging booth data
- ✅ One-off analysis tasks
- ✅ Command-line usage

### Use Core Backend When:
- ✅ Building a web application
- ✅ Frontend integration needed
- ✅ Multiple users/requests
- ✅ Production deployment
- ✅ API endpoints required

---

## 💡 Can They Work Together?

**Yes, but they don't need to!**

### Scenario 1: Both Running Independently
```bash
# Terminal 1: Run main.py for analysis
python main.py

# Terminal 2: Run API server for frontend
python api_server.py
```
They both work fine, accessing the same database and LLM.

### Scenario 2: main.py Could Use Core Services
You could modify `main.py` to use the core services:

```python
# Modified main.py (using core services)
from llm_service import BedrockLLMService
from database_service import DatabaseService
from config import BEDROCK_MODEL_ID
import os
from dotenv import load_dotenv

load_dotenv()

# Use core services instead of direct calls
llm = BedrockLLMService(
    region=os.getenv("AWS_REGION"),
    access_key=os.getenv("AWS_ACCESS_KEY_ID"),
    secret_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    model_id=BEDROCK_MODEL_ID
)

db = DatabaseService(
    supabase_url=os.getenv("supabaseUrl"),
    supabase_key=os.getenv("supabaseKey")
)

# Now use the services
data = db.fetch_all_events()
result = llm.parse_user_preferences("Find affordable booths")
```

But currently, it doesn't - it's standalone for simplicity.

---

## 📝 Summary

### Current State
```
main.py ────────────┐
                    ├──→ config.py
api_server.py ──────┤
                    ├──→ .env
llm_service.py ─────┤
                    ├──→ AWS Bedrock
database_service.py ┤
                    └──→ Supabase
event_matcher.py

main.py = Standalone (doesn't import other core files)
Core Backend = Integrated (all files work together)
```

### Key Points
1. **main.py is independent** - Doesn't use core backend files
2. **Both access same resources** - Same database, same LLM
3. **Different purposes** - main.py for analysis, core backend for API
4. **Can run simultaneously** - No conflicts
5. **Shared config** - Both use `config.py` and `.env`

---

## 🎯 Recommendation

**Keep them separate!**

- `main.py` - Simple, standalone analysis tool
- Core Backend - Production API system

They serve different purposes and work well independently.

If you want to consolidate, you could:
1. Delete `main.py` (use API endpoints instead)
2. Or modify `main.py` to use core services (more complex)

But the current setup is clean and practical! ✅
