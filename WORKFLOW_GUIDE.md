# Workflow Guide - How the System Works

## 🎬 Complete User Journey

### Scenario: Vendor Searches for an Event

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Input                                          │
│ Vendor types: "I need a weekend bazaar in Jakarta          │
│                under 3 million rupiah"                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend sends HTTP POST                            │
│ POST /api/events/search                                     │
│ Body: {"query": "I need a weekend bazaar..."}              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: API Server receives request                         │
│ • Validates input                                            │
│ • Extracts query parameter                                   │
│ • Calls event_matcher.find_matching_events()                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Event Matcher orchestrates                          │
│ Starts multi-stage matching pipeline                        │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌──────────────────┐              ┌──────────────────┐
│ STAGE 1:         │              │ STAGE 2:         │
│ Parse Preferences│              │ Pre-filter DB    │
└────────┬─────────┘              └────────┬─────────┘
         │                                  │
         ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ LLM Service: parse_user_preferences()                       │
│                                                              │
│ Prompt to Bedrock:                                          │
│ "Extract preferences from: 'I need a weekend bazaar...'"   │
│                                                              │
│ Bedrock Response (JSON):                                    │
│ {                                                            │
│   "location": "Jakarta",                                     │
│   "date_preference": "weekend",                              │
│   "budget_range": {"max": 3000000},                         │
│   "event_type": "bazaar"                                     │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Database Service: fetch_events_by_criteria()                │
│                                                              │
│ SQL Query:                                                   │
│ SELECT * FROM bazaar_booths                                 │
│ WHERE location ILIKE '%Jakarta%'                            │
│   AND booth_price <= 3000000                                │
│                                                              │
│ Returns: 50 candidate events                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: LLM Ranking                                        │
│ LLM Service: filter_events_with_llm()                       │
│                                                              │
│ Prompt to Bedrock:                                          │
│ "Here are 50 events [event data]. Rank them based on       │
│  preferences: {location: Jakarta, budget: 3M, weekend}"    │
│                                                              │
│ Bedrock Response (JSON):                                    │
│ {                                                            │
│   "matches": [                                               │
│     {                                                        │
│       "event_id": "abc-123",                                │
│       "relevance_score": 95,                                │
│       "match_reasons": ["Location matches",                 │
│                         "Within budget",                    │
│                         "Weekend event"],                   │
│       "concerns": []                                         │
│     },                                                       │
│     ...                                                      │
│   ]                                                          │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: Validation (CRITICAL - Prevents Hallucination)    │
│ Event Matcher: _validate_and_enrich_matches()              │
│                                                              │
│ For each event_id from LLM:                                 │
│   1. Check if ID exists in database                         │
│   2. If YES: Get full event data from database             │
│   3. If NO: Reject (LLM hallucinated)                      │
│   4. Combine database data + LLM scores                     │
│                                                              │
│ Result: Only validated events with full data                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: API Server formats response                         │
│                                                              │
│ Response JSON:                                               │
│ {                                                            │
│   "success": true,                                           │
│   "user_input": "I need a weekend bazaar...",              │
│   "extracted_preferences": {...},                           │
│   "total_candidates": 50,                                    │
│   "matches": [                                               │
│     {                                                        │
│       "id": "abc-123",                                      │
│       "name": "Jakarta Weekend Market",                     │
│       "location": "Jakarta",                                │
│       "booth_price": 2500000,                               │
│       "event_date": "2026-05-17",                           │
│       "relevance_score": 95,                                │
│       "match_reasons": [...],                               │
│       ... (full event data from database)                   │
│     }                                                        │
│   ]                                                          │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Frontend receives and displays results              │
│ • Shows matched events                                       │
│ • Displays relevance scores                                  │
│ • Shows match reasons                                        │
│ • Allows vendor to select event                             │
└─────────────────────────────────────────────────────────────┘
```

## 🤖 Chatbot Conversation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User: "Hi, I'm a dessert vendor looking for events"        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /api/chat                                              │
│ {                                                            │
│   "message": "Hi, I'm a dessert vendor...",                │
│   "conversation_history": []                                │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Event Matcher: chat()                                       │
│ • Gets available events from database                       │
│ • Sends to LLM with conversation context                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ LLM Service: generate_chatbot_response()                    │
│                                                              │
│ Prompt to Bedrock:                                          │
│ "You are a helpful assistant for food vendors.             │
│  Available events: [event list]                             │
│  User: Hi, I'm a dessert vendor looking for events         │
│  Respond helpfully based on available events."             │
│                                                              │
│ Bedrock Response:                                           │
│ "Hello! Great to meet you. I can help you find events      │
│  suitable for dessert vendors. We currently have 15 events │
│  available. Would you like to know about weekend events,   │
│  or do you have a specific location in mind?"              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Response to Frontend:                                        │
│ {                                                            │
│   "success": true,                                           │
│   "response": "Hello! Great to meet you...",               │
│   "timestamp": "2026-05-13T10:30:00"                        │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ User sees response and continues conversation               │
│ User: "What events do you have this weekend?"              │
└─────────────────────────────────────────────────────────────┘
         │
         └──► (Repeat with updated conversation_history)
```

## 🛡️ Hallucination Prevention in Action

### Example: LLM tries to hallucinate

```
┌─────────────────────────────────────────────────────────────┐
│ LLM Returns:                                                │
│ {                                                            │
│   "matches": [                                               │
│     {"event_id": "real-event-123", "score": 95},           │
│     {"event_id": "fake-event-999", "score": 90},  ← FAKE!  │
│     {"event_id": "real-event-456", "score": 85}            │
│   ]                                                          │
│ }                                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Validation Layer: _validate_and_enrich_matches()           │
│                                                              │
│ Check "real-event-123":                                     │
│   ✅ EXISTS in database → Include in results                │
│                                                              │
│ Check "fake-event-999":                                     │
│   ❌ NOT FOUND in database → REJECT (hallucination!)       │
│                                                              │
│ Check "real-event-456":                                     │
│   ✅ EXISTS in database → Include in results                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Final Results: Only 2 events (fake one removed)            │
│ {                                                            │
│   "matches": [                                               │
│     {... full data for real-event-123 from DB ...},        │
│     {... full data for real-event-456 from DB ...}         │
│   ]                                                          │
│ }                                                            │
│                                                              │
│ ✅ Hallucination prevented!                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Summary

```
User Input (Natural Language)
    ↓
API Server (Validation)
    ↓
Event Matcher (Orchestration)
    ↓
    ├─→ LLM Service → Parse to JSON
    │       ↓
    │   Structured Preferences
    │       ↓
    ├─→ Database Service → Pre-filter
    │       ↓
    │   Candidate Events (50)
    │       ↓
    ├─→ LLM Service → Rank & Match
    │       ↓
    │   Ranked Results with IDs
    │       ↓
    └─→ Database Service → Validate IDs
            ↓
        Validated Events Only
            ↓
        Enrich with Full Data
            ↓
API Server (Format Response)
    ↓
Frontend (Display Results)
```

## 📊 Token Usage Optimization

```
┌─────────────────────────────────────────────────────────────┐
│ Without Optimization:                                        │
│ • Send all 500 events to LLM                                │
│ • Input tokens: ~50,000                                     │
│ • Cost per query: ~$0.15                                    │
│ • Slow response time                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ With Our Optimization:                                       │
│ • Pre-filter to 50 events using SQL                         │
│ • Input tokens: ~5,000                                      │
│ • Cost per query: ~$0.02                                    │
│ • Fast response time                                         │
│ • 87% cost reduction!                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Decision Points

### When to use Database filtering vs LLM filtering?

```
┌─────────────────────────────────────────────────────────────┐
│ Use DATABASE filtering for:                                 │
│ ✅ Exact matches (location = "Jakarta")                     │
│ ✅ Numeric ranges (price <= 3000000)                        │
│ ✅ Date comparisons (date >= today)                         │
│ ✅ Boolean filters (is_active = true)                       │
│                                                              │
│ Advantages: Fast, cheap, precise                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Use LLM filtering for:                                      │
│ ✅ Semantic matching ("high-traffic" → crowd_size)          │
│ ✅ Fuzzy preferences ("affordable" → price range)           │
│ ✅ Complex reasoning (multiple factors)                     │
│ ✅ Ranking by relevance                                     │
│                                                              │
│ Advantages: Intelligent, flexible, user-friendly            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Our Approach: BOTH!                                         │
│ 1. Database pre-filters (fast, cheap)                       │
│ 2. LLM ranks remaining (intelligent)                        │
│ 3. Best of both worlds                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Error Handling Flow

```
Error Occurs
    │
    ├─→ LLM Service Error
    │       ├─→ AWS connection failed
    │       │       └─→ Return: "LLM service unavailable"
    │       ├─→ JSON parsing failed
    │       │       └─→ Return: Empty preferences {}
    │       └─→ Timeout
    │               └─→ Return: "Request timeout"
    │
    ├─→ Database Service Error
    │       ├─→ Connection failed
    │       │       └─→ Return: Empty array []
    │       ├─→ Query failed
    │       │       └─→ Log error, return []
    │       └─→ Validation failed
    │               └─→ Reject invalid data
    │
    └─→ API Server Error
            ├─→ Invalid input
            │       └─→ HTTP 400 + error message
            ├─→ Internal error
            │       └─→ HTTP 500 + safe error message
            └─→ Not found
                    └─→ HTTP 404 + error message

All errors logged for debugging
User receives friendly error message
System continues to function
```

## 🚀 Performance Optimization Flow

```
Request Arrives
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Check Cache (Future Enhancement)                            │
│ • If cached: Return immediately                             │
│ • If not: Continue to processing                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Database Pre-filtering                                       │
│ • Reduces dataset from 500 → 50 events                     │
│ • 90% reduction in data sent to LLM                         │
│ • Saves tokens and cost                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Parallel Processing (Future Enhancement)                    │
│ • LLM call and database queries in parallel                 │
│ • Reduces total response time                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Response Caching (Future Enhancement)                       │
│ • Cache results for 5-15 minutes                            │
│ • Similar queries get instant results                       │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Summary

This system provides:
- ✅ Natural language understanding
- ✅ Intelligent event matching
- ✅ Robust hallucination prevention
- ✅ Conversational assistance
- ✅ Cost-optimized processing
- ✅ Fast response times
- ✅ Reliable error handling
- ✅ Easy frontend integration

**Ready to help food vendors find their perfect events!** 🎉
