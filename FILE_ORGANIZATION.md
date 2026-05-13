# 📁 File Organization Guide

## 🎯 MAIN FILES (Core System - Keep These!)

### Production Backend Files
```
✅ api_server.py          - Main API server (START THIS for production)
✅ llm_service.py          - LLM/AI integration
✅ database_service.py     - Database operations
✅ event_matcher.py        - Business logic orchestration
✅ config.py               - Configuration settings
✅ .env                    - Credentials (NEVER commit to git!)
✅ requirements.txt        - Python dependencies
✅ .gitignore             - Git ignore rules
```

### Quick Analysis Script
```
✅ main.py                 - Quick booth analysis script (optional utility)
```

---

## 🧪 TESTING FILES (For Development/Debugging)

### Integration Tests
```
🧪 test_integration.py     - Full system test
🧪 test_supabase_only.py   - Test database connection
🧪 test_sonnet_45.py       - Test LLM/Bedrock
🧪 example_client.py       - API usage examples
```

### Diagnostic Tools
```
🔍 check_bedrock_models.py      - List available Bedrock models
🔍 find_sonnet_45_profile.py    - Find Sonnet 4.5 inference profile
🔍 test_all_models.py           - Test all available models
🔍 verify_credentials.py        - Verify AWS/Supabase credentials
```

---

## 📚 DOCUMENTATION FILES (Reference Only)

### Main Documentation
```
📖 README.md                    - Project overview
📖 README_BACKEND.md            - Complete technical documentation
📖 QUICK_REFERENCE.md           - Quick command reference
📖 FINAL_SUMMARY.md             - Final status and guide
📖 SUCCESS_SUMMARY.md           - Success details
```

### Setup Guides
```
📖 QUICKSTART.md                - 5-minute setup guide
📖 SETUP_MODEL_ID.md            - Model ID configuration
📖 CONFIGURATION_CHECKLIST.md   - Setup checklist
📖 BEDROCK_SETUP_REQUIRED.md    - Bedrock setup guide
📖 GET_SUPABASE_KEY.md          - Supabase key guide
```

### Architecture & Deployment
```
📖 ARCHITECTURE.md              - System architecture
📖 WORKFLOW_GUIDE.md            - How the system works
📖 DEPLOYMENT_GUIDE.md          - Production deployment
📖 PROJECT_SUMMARY.md           - Project summary
📖 CURRENT_STATUS.md            - System status
📖 INDEX.md                     - Documentation index
```

---

## 🗂️ RECOMMENDED FILE STRUCTURE

### Keep for Production:
```
your-project/
├── 🎯 CORE BACKEND (REQUIRED)
│   ├── api_server.py
│   ├── llm_service.py
│   ├── database_service.py
│   ├── event_matcher.py
│   ├── config.py
│   ├── .env
│   ├── requirements.txt
│   └── .gitignore
│
├── 📖 DOCUMENTATION (REFERENCE)
│   ├── README.md
│   ├── README_BACKEND.md
│   ├── QUICK_REFERENCE.md
│   └── FINAL_SUMMARY.md
│
└── 🧪 TESTING (OPTIONAL - for development)
    ├── test_integration.py
    ├── test_supabase_only.py
    ├── test_sonnet_45.py
    └── example_client.py
```

---

## 🚀 WHAT TO RUN

### For Production (Frontend Integration):
```bash
python api_server.py
```
This starts the REST API server on http://localhost:5000

### For Quick Analysis:
```bash
python main.py
```
This analyzes booth data and shows AI insights

### For Testing:
```bash
python test_integration.py    # Test everything
python example_client.py       # Test API endpoints
```

---

## 🗑️ FILES YOU CAN DELETE (After Setup)

Once your system is working, you can safely delete these:

### Diagnostic/Setup Tools (Delete after setup complete):
```
❌ check_bedrock_models.py
❌ find_sonnet_45_profile.py
❌ test_all_models.py
❌ verify_credentials.py
```

### Extra Documentation (Keep only what you need):
```
❌ BEDROCK_SETUP_REQUIRED.md    (setup complete)
❌ GET_SUPABASE_KEY.md          (setup complete)
❌ SETUP_MODEL_ID.md            (setup complete)
❌ CONFIGURATION_CHECKLIST.md   (setup complete)
❌ CURRENT_STATUS.md            (outdated)
❌ PROJECT_SUMMARY.md           (use FINAL_SUMMARY.md instead)
❌ SUCCESS_SUMMARY.md           (use FINAL_SUMMARY.md instead)
```

---

## 📋 MINIMAL PRODUCTION SETUP

If you want the absolute minimum for production:

```
your-project/
├── api_server.py          ← START THIS
├── llm_service.py
├── database_service.py
├── event_matcher.py
├── config.py
├── .env
├── requirements.txt
├── .gitignore
└── README.md              ← Keep for reference
```

That's it! Everything else is optional.

---

## 🎯 QUICK DECISION GUIDE

**Q: Which file do I run for production?**  
**A:** `python api_server.py`

**Q: Which files are absolutely required?**  
**A:** The 8 files in "CORE BACKEND" section above

**Q: Can I delete test files?**  
**A:** Yes, after confirming everything works

**Q: Which documentation should I keep?**  
**A:** At minimum: `README.md`, `QUICK_REFERENCE.md`, `FINAL_SUMMARY.md`

**Q: What about main.py?**  
**A:** Optional utility for quick analysis. Not required for API server.

---

## 📊 FILE CATEGORIES SUMMARY

| Category | Count | Keep? | Purpose |
|----------|-------|-------|---------|
| **Core Backend** | 8 files | ✅ YES | Required for production |
| **Testing** | 7 files | 🔶 Optional | Development/debugging |
| **Documentation** | 15 files | 🔶 Optional | Reference (keep 2-3) |
| **Total** | 30 files | | |

**Recommended to keep: 10-15 files**  
**Minimum required: 8 files**

---

## 🎓 FINAL RECOMMENDATION

### For Development:
Keep everything - useful for debugging and reference

### For Production:
1. Keep all "Core Backend" files (8 files)
2. Keep 2-3 documentation files (README.md, QUICK_REFERENCE.md, FINAL_SUMMARY.md)
3. Keep 1-2 test files (test_integration.py, example_client.py)
4. Delete diagnostic tools and extra documentation

**Total: ~13 files for production**
