# System Architecture

## Overview

The Food Vendor Event Matching System uses a three-tier architecture with AI-powered intelligence and robust hallucination prevention.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND / UI                         │
│                  (React, Vue, or any JS)                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP REST API
                         │ JSON Request/Response
┌────────────────────────▼────────────────────────────────────┐
│                    API LAYER (Flask)                         │
│                     api_server.py                            │
│                                                              │
│  Endpoints:                                                  │
│  • POST /api/events/search    - Natural language search     │
│  • POST /api/chat             - Chatbot conversation        │
│  • GET  /api/events/all       - List all events             │
│  • GET  /api/events/:id       - Get specific event          │
│  • POST /api/preferences/parse - Parse NL to structured     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              ORCHESTRATION LAYER                             │
│                 event_matcher.py                             │
│                                                              │
│  Responsibilities:                                           │
│  • Coordinate LLM and Database services                     │
│  • Validate all LLM outputs against database                │
│  • Prevent hallucination through validation                 │
│  • Enrich results with full event data                      │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
┌────────────▼──────────────┐  ┌────────▼─────────────────────┐
│     LLM SERVICE            │  │    DATABASE SERVICE          │
│   llm_service.py           │  │  database_service.py         │
│                            │  │                              │
│  Functions:                │  │  Functions:                  │
│  • Parse preferences       │  │  • Fetch all events          │
│  • Filter & rank events    │  │  • Filter by criteria        │
│  • Generate chat responses │  │  • Validate event IDs        │
│  • Extract JSON            │  │  • Get event by ID           │
└────────────┬──────────────┘  └────────┬─────────────────────┘
             │                           │
┌────────────▼──────────────┐  ┌────────▼─────────────────────┐
│      AWS BEDROCK           │  │       SUPABASE               │
│   Claude 3 Sonnet          │  │   PostgreSQL Database        │
│                            │  │                              │
│  • Natural language        │  │  • Event storage             │
│    understanding           │  │  • Vendor data               │
│  • JSON parsing            │  │  • Real-time queries         │
│  • Intelligent matching    │  │  • Data validation           │
└────────────────────────────┘  └──────────────────────────────┘
```

## Data Flow

### 1. Event Search Flow

```
User Input: "I need a weekend bazaar in Jakarta under 3M"
    │
    ▼
[API Server] Receives request
    │
    ▼
[Event Matcher] Orchestrates the process
    │
    ├─► [LLM Service] Parse preferences
    │       │
    │       ▼
    │   AWS Bedrock: Extract structured JSON
    │       │
    │       ▼
    │   Returns: {location: "Jakarta", budget: {max: 3000000}, ...}
    │
    ├─► [Database Service] Pre-filter events
    │       │
    │       ▼
    │   Supabase: SQL query with filters
    │       │
    │       ▼
    │   Returns: 50 candidate events
    │
    ├─► [LLM Service] Rank and match
    │       │
    │       ▼
    │   AWS Bedrock: Intelligent ranking
    │       │
    │       ▼
    │   Returns: [event_id: "123", score: 95, ...]
    │
    └─► [Event Matcher] Validate & enrich
            │
            ▼
        [Database Service] Validate IDs exist
            │
            ▼
        Returns: Full event data with scores
            │
            ▼
        [API Server] Send response to UI
```

### 2. Chatbot Flow

```
User: "What events do you have?"
    │
    ▼
[API Server] Receives chat message
    │
    ▼
[Event Matcher] Process conversation
    │
    ├─► [Database Service] Get available events
    │       │
    │       ▼
    │   Returns: Current event list
    │
    └─► [LLM Service] Generate response
            │
            ▼
        AWS Bedrock: Context-aware response
            │
            ▼
        Returns: "We have 15 events this weekend..."
            │
            ▼
        [API Server] Send to UI
```

## Hallucination Prevention Strategy

### Multi-Layer Validation

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Structured Input                               │
│ • Parse natural language to JSON schema                 │
│ • Validate JSON structure                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ Layer 2: Database Pre-filtering                         │
│ • Use SQL queries to narrow candidates                  │
│ • Only send real data to LLM                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ Layer 3: Context Grounding                              │
│ • Send actual event data to LLM                         │
│ • Explicit instructions against invention               │
│ • Low temperature (0.3) for consistency                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ Layer 4: Output Validation                              │
│ • Verify all event IDs exist in database                │
│ • Cross-reference LLM output with source data           │
│ • Reject any invented IDs                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ Layer 5: Data Enrichment                                │
│ • Replace LLM data with database data                   │
│ • Use database as source of truth                       │
│ • Only keep LLM scores and reasoning                    │
└─────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### API Server (`api_server.py`)
- **Role**: HTTP interface layer
- **Responsibilities**:
  - Handle HTTP requests/responses
  - Input validation
  - Error handling
  - CORS configuration
- **Does NOT**: Business logic, LLM calls, database queries

### Event Matcher (`event_matcher.py`)
- **Role**: Orchestration and validation
- **Responsibilities**:
  - Coordinate LLM and database services
  - Validate all outputs
  - Prevent hallucination
  - Enrich results
- **Key Feature**: Single source of truth validation

### LLM Service (`llm_service.py`)
- **Role**: AI intelligence layer
- **Responsibilities**:
  - Parse natural language
  - Rank and filter events
  - Generate chat responses
  - Extract structured data
- **Does NOT**: Store data, make final decisions

### Database Service (`database_service.py`)
- **Role**: Data persistence layer
- **Responsibilities**:
  - CRUD operations
  - SQL filtering
  - Data validation
  - ID verification
- **Key Feature**: Source of truth for all data

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│ 1. Environment Variables (.env)                         │
│    • AWS credentials                                     │
│    • Supabase credentials                                │
│    • Never committed to git                              │
├─────────────────────────────────────────────────────────┤
│ 2. API Layer                                            │
│    • Input validation                                    │
│    • CORS configuration                                  │
│    • Rate limiting (TODO)                                │
├─────────────────────────────────────────────────────────┤
│ 3. Service Layer                                        │
│    • Output validation                                   │
│    • Hallucination prevention                            │
│    • Error handling                                      │
├─────────────────────────────────────────────────────────┤
│ 4. Data Layer                                           │
│    • Supabase RLS (Row Level Security)                  │
│    • SQL injection prevention                            │
│    • Data validation                                     │
└─────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture (MVP)
- Single Flask server
- Direct AWS Bedrock calls
- Direct Supabase queries
- Suitable for: 100-1000 requests/day

### Future Scaling Options

```
┌─────────────────────────────────────────────────────────┐
│ Load Balancer (nginx)                                   │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐ ┌─▼────┐ ┌─▼────┐
│Flask 1│ │Flask 2│ │Flask 3│  (Multiple instances)
└───┬───┘ └──┬───┘ └──┬───┘
    │        │        │
    └────────┼────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐ ┌─▼────────▼──┐
│ Redis │ │  Supabase   │
│ Cache │ │  (Pooling)  │
└───────┘ └─────────────┘
```

### Optimization Strategies

1. **Caching Layer** (Redis)
   - Cache frequent queries
   - Cache LLM responses for similar inputs
   - TTL: 5-15 minutes

2. **Database Connection Pooling**
   - Reuse Supabase connections
   - Reduce connection overhead

3. **Async Processing**
   - Use async/await for I/O operations
   - Parallel LLM and database calls

4. **Rate Limiting**
   - Prevent abuse
   - Protect AWS Bedrock costs

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| API | Flask | HTTP server |
| LLM | AWS Bedrock (Claude 3) | Natural language processing |
| Database | Supabase (PostgreSQL) | Data storage |
| Language | Python 3.13 | Backend logic |
| CORS | Flask-CORS | Frontend integration |
| Environment | python-dotenv | Configuration |

## Deployment Architecture

### Development
```
Local Machine
├── Python 3.13 venv
├── Flask dev server (port 5000)
├── Direct AWS Bedrock access
└── Direct Supabase access
```

### Production (Recommended)
```
Cloud Provider (AWS/GCP/Azure)
├── Application Server
│   ├── Gunicorn (WSGI)
│   ├── Multiple workers
│   └── Process manager (systemd/supervisor)
├── Reverse Proxy
│   ├── nginx
│   └── SSL/TLS termination
├── External Services
│   ├── AWS Bedrock (same region)
│   └── Supabase (managed)
└── Monitoring
    ├── Logging (CloudWatch/Datadog)
    └── Metrics (Prometheus/Grafana)
```

## Error Handling Flow

```
Error Occurs
    │
    ▼
Service Layer Catches
    │
    ├─► Log error details
    │
    ├─► Return safe error message
    │
    └─► HTTP 500/400 response
            │
            ▼
        API Layer formats
            │
            ▼
        Client receives JSON error
```

## Monitoring Points

1. **API Layer**
   - Request count
   - Response times
   - Error rates

2. **LLM Service**
   - Bedrock API calls
   - Token usage
   - Response times
   - JSON parsing failures

3. **Database Service**
   - Query times
   - Connection pool status
   - Failed queries

4. **Business Metrics**
   - Successful matches
   - User satisfaction
   - Hallucination rate (validated rejections)
