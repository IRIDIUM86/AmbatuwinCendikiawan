# Food Vendor Event Matching Backend

## Overview
This backend system uses AWS Bedrock (Claude 3 Sonnet) and Supabase to help food vendors find suitable events through:
- **Natural Language Processing**: Parse vendor preferences from conversational input
- **Intelligent Event Matching**: AI-powered filtering and ranking
- **Hallucination Prevention**: All LLM outputs validated against database
- **Chatbot Interface**: Conversational assistance for vendors

## Architecture

```
┌─────────────┐
│   UI/Frontend│
└──────┬──────┘
       │ HTTP REST API
┌──────▼──────────────────────────────────┐
│         api_server.py (Flask)           │
│  Endpoints: /search, /chat, /events     │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│      event_matcher.py (Orchestrator)    │
│  - Coordinates LLM + Database           │
│  - Validates all outputs                │
└──────┬──────────────────────────────────┘
       │
   ┌───┴────┐
   │        │
┌──▼───┐ ┌─▼────────┐
│ LLM  │ │ Database │
│Service│ │ Service  │
└──┬───┘ └─┬────────┘
   │       │
┌──▼───┐ ┌▼────────┐
│Bedrock│ │Supabase│
└──────┘ └─────────┘
```

## Key Features

### 1. Hallucination Prevention
- **Database Validation**: All LLM-generated event IDs validated against Supabase
- **Grounded Responses**: LLM receives actual event data, not allowed to invent details
- **Structured Output**: JSON parsing with strict validation
- **Two-Stage Filtering**: Database pre-filtering + LLM ranking

### 2. Prompt Engineering
- **Preference Extraction**: Converts natural language to structured JSON
- **Context Grounding**: LLM always receives current database state
- **Temperature Control**: Low temperature (0.3) for consistent outputs
- **Clear Instructions**: Explicit rules against hallucination in prompts

### 3. Efficient Token Usage
- **Database Pre-filtering**: Reduces events sent to LLM
- **Selective Data**: Only necessary fields sent to LLM
- **Conversation History Limiting**: Last 5 messages only

## Installation

1. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure environment variables** (`.env`):
```env
# Supabase
supabaseUrl=your_supabase_url
supabaseKey=your_supabase_key

# AWS Bedrock
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-2
```

3. **Verify installation**:
```bash
python test_integration.py
```

## API Endpoints

### 1. Search Events
**POST** `/api/events/search`

Find events matching natural language query.

```json
Request:
{
  "query": "I need a weekend bazaar in Jakarta under 3 million rupiah"
}

Response:
{
  "success": true,
  "user_input": "...",
  "extracted_preferences": {
    "location": "Jakarta",
    "budget_range": {"max": 3000000},
    "date_preference": "weekend"
  },
  "matches": [
    {
      "id": "event_123",
      "name": "Jakarta Weekend Market",
      "relevance_score": 95,
      "match_reasons": ["Location matches", "Within budget"],
      "booth_price": 2500000,
      ...
    }
  ]
}
```

### 2. Chatbot
**POST** `/api/chat`

Conversational interface for vendor assistance.

```json
Request:
{
  "message": "What events do you have this weekend?",
  "conversation_history": [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello! How can I help?"}
  ]
}

Response:
{
  "success": true,
  "response": "I can help you find weekend events! We have several bazaars...",
  "timestamp": "2026-05-13T10:30:00"
}
```

### 3. Get All Events
**GET** `/api/events/all`

Retrieve all available events.

### 4. Get Event by ID
**GET** `/api/events/<event_id>`

Get details for a specific event.

### 5. Parse Preferences
**POST** `/api/preferences/parse`

Extract structured preferences from natural language.

```json
Request:
{
  "input": "Large booth at weekend market under 5 million"
}

Response:
{
  "success": true,
  "preferences": {
    "booth_size": "large",
    "date_preference": "weekend",
    "budget_range": {"max": 5000000}
  }
}
```

## Running the Server

### Development Mode
```bash
python api_server.py
```
Server runs on `http://localhost:5000`

### Production Mode
Use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

## Database Schema

Expected Supabase table structure (`bazaar_booths`):

```sql
CREATE TABLE bazaar_booths (
  id UUID PRIMARY KEY,
  name TEXT,
  event_type TEXT,
  location TEXT,
  booth_price NUMERIC,
  booth_size TEXT,
  event_date DATE,
  crowd_size TEXT,
  food_category TEXT,
  description TEXT,
  created_at TIMESTAMP
);
```

## Hallucination Prevention Strategy

1. **Input Validation**: Parse user input into structured format
2. **Database Pre-filtering**: Use SQL queries to narrow candidates
3. **Context Grounding**: Send actual event data to LLM
4. **Output Validation**: Verify all LLM-returned IDs exist in database
5. **Explicit Instructions**: Prompts explicitly forbid inventing data
6. **Low Temperature**: Use temperature=0.3 for deterministic outputs

## Testing

Run the integration test:
```bash
python test_integration.py
```

This tests:
- Database connectivity
- LLM preference parsing
- Event matching pipeline
- Chatbot functionality

## Frontend Integration

### JavaScript Example
```javascript
// Search for events
const searchEvents = async (query) => {
  const response = await fetch('http://localhost:5000/api/events/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
};

// Chat with assistant
const chat = async (message, history) => {
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      conversation_history: history 
    })
  });
  return await response.json();
};
```

## Security Considerations

1. **API Keys**: Never commit `.env` to version control
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Add rate limiting for production use
4. **Input Sanitization**: Validate all user inputs
5. **AWS IAM**: Use least-privilege IAM policies for Bedrock access

## Troubleshooting

### LLM Returns Invalid JSON
- Check prompt formatting
- Verify temperature setting
- Review LLM response in logs

### No Events Found
- Verify Supabase connection
- Check table name matches
- Ensure events exist in database

### AWS Bedrock Errors
- Verify credentials in `.env`
- Check IAM permissions for Bedrock
- Ensure model ID is correct for your region

## Future Enhancements

- [ ] Add caching layer (Redis) for frequent queries
- [ ] Implement user authentication
- [ ] Add event CRUD operations
- [ ] Support multiple languages
- [ ] Add analytics and logging
- [ ] Implement webhook notifications
