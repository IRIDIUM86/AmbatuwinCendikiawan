# Technical Design Document: React SPA Frontend Integration

## 1. Introduction

This document provides the technical design for a React-based Single-Page Application (SPA) that integrates with the existing Flask backend API. The frontend will provide food vendors with a comprehensive event discovery platform featuring event browsing, advanced search, AI chatbot interaction, and event comparison capabilities.

### 1.1 Design Goals

- **Seamless Integration**: Connect to all 6 Flask API endpoints without modification to backend
- **Responsive Experience**: Support mobile (320px) to desktop (1920px) screen sizes
- **Performance**: Initial load under 2 seconds, smooth interactions with loading states
- **Accessibility**: WCAG AA compliance for inclusive user experience
- **Maintainability**: Clean component architecture with centralized state management

### 1.2 Technology Stack

- **Framework**: React 18+ with functional components and hooks
- **Build Tool**: Vite (preferred for faster builds) or Create React App
- **State Management**: React Context API with useReducer for global state
- **Routing**: React Router v6 for client-side navigation
- **UI Framework**: Material-UI (MUI) v5 for consistent design system
- **HTTP Client**: Axios with interceptors for API communication
- **Storage**: Browser localStorage for preferences, sessionStorage for session data
- **Language**: TypeScript for type safety
- **Testing**: Vitest + React Testing Library for unit tests

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React SPA Frontend                       │
│                   (Port 3000 - Development)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/JSON
                         │ CORS Enabled
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Flask Backend API                          │
│                   (Port 5000 - Backend)                      │
│                                                              │
│  Endpoints:                                                  │
│  • GET  /api/health                                          │
│  • GET  /api/events/all                                      │
│  • GET  /api/events/:id                                      │
│  • POST /api/events/search                                   │
│  • POST /api/chat                                            │
│  • POST /api/preferences/parse                               │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```
App (Root)
├── AppProvider (Global State Context)
├── Router
│   ├── Layout (Persistent UI Shell)
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── HealthIndicator
│   │   │   └── MobileMenuButton
│   │   ├── TabNavigation
│   │   │   ├── ChatTab
│   │   │   ├── BrowseTab
│   │   │   └── SearchTab
│   │   └── Footer
│   │
│   └── Routes
│       ├── ChatView
│       │   ├── ChatContainer
│       │   │   ├── MessageList
│       │   │   │   ├── UserMessage
│       │   │   │   ├── AssistantMessage
│       │   │   │   └── EventCardInline
│       │   │   ├── TypingIndicator
│       │   │   └── MessageInput
│       │   └── QuickActions
│       │
│       ├── BrowseView
│       │   ├── FilterPanel
│       │   │   ├── LocationFilter
│       │   │   ├── DateRangeFilter
│       │   │   └── PriceFilter
│       │   ├── EventGrid
│       │   │   └── EventCard (repeated)
│       │   └── EventCounter
│       │
│       ├── SearchView
│       │   ├── SearchForm
│       │   │   ├── LocationInput
│       │   │   ├── DateRangeInput
│       │   │   ├── BudgetInput
│       │   │   ├── BoothSizeInput
│       │   │   ├── EventTypeInput
│       │   │   └── NaturalLanguageInput
│       │   ├── SavedPreferences
│       │   │   └── PreferenceItem (repeated)
│       │   └── SearchResults
│       │       └── EventCard (with score)
│       │
│       ├── EventDetailView
│       │   ├── EventHeader
│       │   ├── EventImages
│       │   ├── EventInfo
│       │   ├── BoothOptions
│       │   ├── LocationMap
│       │   └── ActionButtons
│       │       ├── BackButton
│       │       ├── AddToCompareButton
│       │       └── ContactButton
│       │
│       └── ComparisonView
│           ├── ComparisonTable
│           │   ├── EventColumn (up to 4)
│           │   └── AttributeRow (repeated)
│           └── ComparisonControls
│
├── LoadingOverlay (Global)
├── ErrorBoundary (Global)
└── ToastNotifications (Global)
```


## 3. State Management Architecture

### 3.1 Global State Structure

```typescript
interface AppState {
  // API Health
  apiHealth: {
    isConnected: boolean;
    lastChecked: Date | null;
    eventCount: number;
  };
  
  // Events Data
  events: {
    all: Event[];
    filtered: Event[];
    searchResults: Event[];
    currentEvent: Event | null;
    loading: boolean;
    error: string | null;
  };
  
  // Filters
  filters: {
    location: string;
    dateRange: { start: Date | null; end: Date | null };
    priceRange: { min: number; max: number };
  };
  
  // Search
  search: {
    criteria: SearchCriteria;
    results: SearchResult[];
    loading: boolean;
  };
  
  // Chat
  chat: {
    messages: Message[];
    loading: boolean;
    error: string | null;
  };
  
  // Comparison
  comparison: {
    selectedEvents: Event[];
    maxEvents: 4;
  };
  
  // Preferences
  preferences: {
    saved: SavedPreference[];
    current: SearchCriteria | null;
  };
  
  // UI State
  ui: {
    activeTab: 'chat' | 'browse' | 'search';
    isMobile: boolean;
    mobileMenuOpen: boolean;
  };
}
```

### 3.2 State Management Pattern

**Context + Reducer Pattern**:
- Single `AppContext` provides global state
- `useReducer` manages state transitions
- Custom hooks (`useEvents`, `useChat`, `useFilters`) provide domain-specific access
- Actions are strongly typed for predictable state updates

```typescript
// Example: useEvents hook
const useEvents = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const fetchAllEvents = async () => {
    dispatch({ type: 'EVENTS_LOADING' });
    try {
      const events = await api.getAllEvents();
      dispatch({ type: 'EVENTS_LOADED', payload: events });
    } catch (error) {
      dispatch({ type: 'EVENTS_ERROR', payload: error.message });
    }
  };
  
  return {
    events: state.events.all,
    loading: state.events.loading,
    error: state.events.error,
    fetchAllEvents,
  };
};
```

### 3.3 Persistence Strategy

**localStorage** (Persistent across sessions):
- User preferences (saved searches)
- UI preferences (theme, language)
- Comparison selections

**sessionStorage** (Cleared on tab close):
- Active tab selection
- Current filters
- Chat conversation history
- Scroll positions

**Memory only** (Cleared on page reload):
- API response cache (5-minute TTL)
- Loading states
- Error states


## 4. API Integration Layer

### 4.1 API Service Architecture

```typescript
// api/client.ts - Base HTTP client
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Centralized error handling
    const errorMessage = error.response?.data?.error || error.message;
    return Promise.reject(new ApiError(errorMessage, error.response?.status));
  }
);
```

### 4.2 API Endpoints Mapping

```typescript
// api/events.ts
export const eventsApi = {
  // GET /api/events/all
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events/all');
    return response.events;
  },
  
  // GET /api/events/:id
  getById: async (eventId: string): Promise<Event> => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.event;
  },
  
  // POST /api/events/search
  search: async (query: string): Promise<SearchResult[]> => {
    const response = await apiClient.post('/events/search', { query });
    return response.matches;
  },
};

// api/chat.ts
export const chatApi = {
  // POST /api/chat
  sendMessage: async (
    message: string,
    conversationHistory: Message[]
  ): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat', {
      message,
      conversation_history: conversationHistory,
    });
    return response;
  },
};

// api/preferences.ts
export const preferencesApi = {
  // POST /api/preferences/parse
  parse: async (input: string): Promise<SearchCriteria> => {
    const response = await apiClient.post('/preferences/parse', { input });
    return response.preferences;
  },
};

// api/health.ts
export const healthApi = {
  // GET /api/health
  check: async (): Promise<HealthStatus> => {
    const response = await apiClient.get('/health');
    return response;
  },
};
```

### 4.3 Response Caching Strategy

```typescript
// api/cache.ts
class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private ttl = 5 * 60 * 1000; // 5 minutes
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Usage in API calls
const cache = new ApiCache();

export const getCachedEvents = async (): Promise<Event[]> => {
  const cached = cache.get('events:all');
  if (cached) return cached;
  
  const events = await eventsApi.getAll();
  cache.set('events:all', events);
  return events;
};
```

### 4.4 Error Handling

```typescript
// api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
  
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
  
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }
  
  get userMessage(): string {
    if (this.isNetworkError) {
      return 'Unable to connect to server. Please check your connection.';
    }
    if (this.isServerError) {
      return 'Server error occurred. Please try again later.';
    }
    return this.message;
  }
  
  get canRetry(): boolean {
    return this.isNetworkError || this.isServerError;
  }
}
```


## 5. Routing Structure

### 5.1 Route Configuration

```typescript
// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: 'chat',
        element: <ChatView />,
      },
      {
        path: 'browse',
        element: <BrowseView />,
      },
      {
        path: 'search',
        element: <SearchView />,
      },
      {
        path: 'events/:eventId',
        element: <EventDetailView />,
        loader: eventDetailLoader,
      },
      {
        path: 'compare',
        element: <ComparisonView />,
      },
    ],
  },
]);

// Loader for event detail (prefetch data)
async function eventDetailLoader({ params }) {
  const event = await eventsApi.getById(params.eventId);
  return { event };
}
```

### 5.2 Navigation Flow

```
User Entry (/)
    │
    ▼
Redirect to /chat (Default)
    │
    ├─► /chat          - Chat with AI assistant
    ├─► /browse        - Browse all events with filters
    ├─► /search        - Advanced search interface
    ├─► /events/:id    - Event detail view
    └─► /compare       - Side-by-side comparison
```

### 5.3 Tab State Preservation

```typescript
// hooks/useTabState.ts
export const useTabState = () => {
  const location = useLocation();
  
  // Save active tab to session storage
  useEffect(() => {
    const tab = location.pathname.split('/')[1] || 'chat';
    sessionStorage.setItem('activeTab', tab);
  }, [location]);
  
  // Restore tab on mount
  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab && location.pathname === '/') {
      navigate(`/${savedTab}`, { replace: true });
    }
  }, []);
};
```

## 6. Component Design Patterns

### 6.1 Core Components

#### 6.1.1 EventCard Component

```typescript
// components/EventCard.tsx
interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  showScore?: boolean;
  score?: number;
  variant?: 'default' | 'compact' | 'inline';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  showScore,
  score,
  variant = 'default',
}) => {
  return (
    <Card
      onClick={() => onClick?.(event)}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
      role="article"
      aria-label={`Event: ${event.name}`}
    >
      <CardContent>
        <Typography variant="h6" component="h3">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📅 {formatDateRange(event.start_date, event.end_date)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          💰 {formatPriceRange(event.booth_price_min, event.booth_price_max)}
        </Typography>
        {showScore && score && (
          <Chip
            label={`Match: ${score}%`}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
};
```

#### 6.1.2 LoadingState Component

```typescript
// components/LoadingState.tsx
interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
  minDisplayTime?: number; // milliseconds
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  variant = 'spinner',
  minDisplayTime = 300,
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShouldShow(true), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);
  
  if (!shouldShow) return null;
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {variant === 'spinner' ? (
        <>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            {message}
          </Typography>
        </>
      ) : (
        <EventCardSkeleton />
      )}
    </Box>
  );
};
```

#### 6.1.3 ErrorDisplay Component

```typescript
// components/ErrorDisplay.tsx
interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  autoDismiss = false,
  dismissDelay = 5000,
}) => {
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, dismissDelay);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss, dismissDelay]);
  
  return (
    <Alert
      severity="error"
      action={
        <>
          {error.canRetry && onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
          {onDismiss && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onDismiss}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )}
        </>
      }
      role="alert"
      aria-live="assertive"
    >
      <AlertTitle>Error</AlertTitle>
      {error.userMessage}
    </Alert>
  );
};
```


### 6.2 View Components

#### 6.2.1 ChatView

```typescript
// views/ChatView.tsx
export const ChatView: React.FC = () => {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };
  
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <MessageList messages={messages} />
      {loading && <TypingIndicator />}
      <div ref={messagesEndRef} />
      <QuickActions onAction={setInput} />
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={loading}
      />
    </Box>
  );
};
```

#### 6.2.2 BrowseView

```typescript
// views/BrowseView.tsx
export const BrowseView: React.FC = () => {
  const { events, loading, error, fetchAllEvents } = useEvents();
  const { filters, setFilters } = useFilters();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAllEvents();
  }, []);
  
  const filteredEvents = useMemo(() => {
    return applyFilters(events, filters);
  }, [events, filters]);
  
  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };
  
  if (loading) return <LoadingState message="Loading events..." />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchAllEvents} />;
  
  return (
    <Box>
      <FilterPanel filters={filters} onChange={setFilters} />
      <EventCounter total={events.length} filtered={filteredEvents.length} />
      <EventGrid>
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={handleEventClick}
          />
        ))}
      </EventGrid>
    </Box>
  );
};
```

#### 6.2.3 SearchView

```typescript
// views/SearchView.tsx
export const SearchView: React.FC = () => {
  const { search, loading, error } = useSearch();
  const { preferences, savePreference, loadPreference } = usePreferences();
  const [criteria, setCriteria] = useState<SearchCriteria>({});
  
  const handleSearch = async () => {
    await search(criteria);
  };
  
  const handleSavePreference = () => {
    const name = prompt('Enter preference name:');
    if (name) {
      savePreference(name, criteria);
    }
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <SearchForm
          criteria={criteria}
          onChange={setCriteria}
          onSubmit={handleSearch}
          loading={loading}
        />
        <SavedPreferences
          preferences={preferences}
          onLoad={loadPreference}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        {loading && <LoadingState message="Searching events..." />}
        {error && <ErrorDisplay error={error} onRetry={handleSearch} />}
        {!loading && !error && (
          <SearchResults results={search.results} />
        )}
      </Grid>
    </Grid>
  );
};
```

#### 6.2.4 EventDetailView

```typescript
// views/EventDetailView.tsx
export const EventDetailView: React.FC = () => {
  const { eventId } = useParams();
  const { event, loading, error, fetchEvent } = useEventDetail(eventId);
  const { addToComparison } = useComparison();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId]);
  
  if (loading) return <LoadingState message="Loading event details..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => fetchEvent(eventId)} />;
  if (!event) return <NotFound />;
  
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <EventHeader event={event} />
      {event.images && <EventImages images={event.images} />}
      <EventInfo event={event} />
      <BoothOptions options={event.booth_options} />
      <LocationMap location={event.location} coordinates={event.coordinates} />
      
      <Box display="flex" gap={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => addToComparison(event)}
        >
          Add to Compare
        </Button>
        <Button
          variant="outlined"
          href={`mailto:${event.contact_email}`}
        >
          Contact Organizer
        </Button>
      </Box>
    </Box>
  );
};
```

#### 6.2.5 ComparisonView

```typescript
// views/ComparisonView.tsx
export const ComparisonView: React.FC = () => {
  const { selectedEvents, removeEvent, maxEvents } = useComparison();
  
  if (selectedEvents.length < 2) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" gutterBottom>
          Add at least 2 events to compare
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can add up to {maxEvents} events for comparison
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/browse')}
          sx={{ mt: 2 }}
        >
          Browse Events
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Compare Events ({selectedEvents.length}/{maxEvents})
      </Typography>
      <ComparisonTable
        events={selectedEvents}
        onRemove={removeEvent}
      />
    </Box>
  );
};
```


## 7. Data Flow Patterns

### 7.1 Event Browsing Flow

```
User navigates to /browse
    │
    ▼
BrowseView mounts
    │
    ▼
useEvents hook calls fetchAllEvents()
    │
    ▼
API: GET /api/events/all
    │
    ├─► Success: Dispatch EVENTS_LOADED
    │       │
    │       ▼
    │   Update state.events.all
    │       │
    │       ▼
    │   Render EventGrid with EventCards
    │
    └─► Error: Dispatch EVENTS_ERROR
            │
            ▼
        Display ErrorDisplay with retry
```

### 7.2 Search Flow

```
User enters search criteria
    │
    ▼
SearchForm updates local state
    │
    ▼
User clicks "Search"
    │
    ▼
useSearch hook calls search(criteria)
    │
    ▼
API: POST /api/events/search
    │
    ├─► Success: Dispatch SEARCH_SUCCESS
    │       │
    │       ▼
    │   Update state.search.results
    │       │
    │       ▼
    │   Render SearchResults with scores
    │
    └─► Error: Dispatch SEARCH_ERROR
            │
            ▼
        Display ErrorDisplay with retry
```

### 7.3 Chat Flow

```
User types message
    │
    ▼
MessageInput updates local state
    │
    ▼
User presses Enter or clicks Send
    │
    ▼
useChat hook calls sendMessage(message)
    │
    ├─► Add user message to state.chat.messages
    │
    ▼
API: POST /api/chat
    │   (includes conversation_history)
    │
    ├─► Success: Dispatch CHAT_RESPONSE
    │       │
    │       ▼
    │   Add assistant message to state.chat.messages
    │       │
    │       ▼
    │   Parse response for event mentions
    │       │
    │       ├─► If events found: Render EventCardInline
    │       └─► Else: Render text message
    │
    └─► Error: Dispatch CHAT_ERROR
            │
            ▼
        Display error message in chat
```

### 7.4 Filter Application Flow

```
User changes filter (e.g., location)
    │
    ▼
FilterPanel calls onChange(newFilters)
    │
    ▼
Debounce 300ms
    │
    ▼
useFilters hook updates state.filters
    │
    ▼
useMemo recalculates filteredEvents
    │
    ▼
EventGrid re-renders with filtered results
    │
    ▼
EventCounter updates count display
```

### 7.5 State Persistence Flow

```
State changes occur
    │
    ├─► Critical state (preferences)
    │       │
    │       ▼
    │   useEffect watches state
    │       │
    │       ▼
    │   localStorage.setItem('preferences', JSON.stringify(state.preferences))
    │
    └─► Session state (filters, tab)
            │
            ▼
        useEffect watches state
            │
            ▼
        sessionStorage.setItem('filters', JSON.stringify(state.filters))

On page load:
    │
    ▼
AppProvider initializes
    │
    ├─► Read localStorage for preferences
    └─► Read sessionStorage for session state
            │
            ▼
        Restore state in reducer
```

## 8. UI/UX Design Patterns

### 8.1 Responsive Breakpoints

```typescript
// theme/breakpoints.ts
export const breakpoints = {
  mobile: 320,    // Mobile devices
  tablet: 768,    // Tablets
  desktop: 1024,  // Desktop
  wide: 1440,     // Wide screens
};

// Usage in components
const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  return { isMobile, isTablet, isDesktop };
};
```

### 8.2 Mobile Navigation Pattern

```typescript
// components/Layout.tsx
export const Layout: React.FC = () => {
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <Logo />
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
              >
                <TabNavigation vertical />
              </Drawer>
            </>
          ) : (
            <TabNavigation />
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
};
```

### 8.3 Touch Target Sizing

```typescript
// theme/components.ts
export const componentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        minHeight: 44,  // WCAG touch target minimum
        minWidth: 44,
        '@media (pointer: coarse)': {
          // Increase for touch devices
          minHeight: 48,
          minWidth: 48,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minHeight: 44,
        minWidth: 44,
      },
    },
  },
};
```

### 8.4 Loading State Patterns

**Skeleton Screens** (for initial loads):
```typescript
<Grid container spacing={2}>
  {[1, 2, 3, 4, 5, 6].map((i) => (
    <Grid item xs={12} sm={6} md={4} key={i}>
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </Grid>
  ))}
</Grid>
```

**Spinners** (for actions):
```typescript
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
>
  {loading ? 'Searching...' : 'Search'}
</Button>
```

### 8.5 Empty States

```typescript
// components/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      textAlign="center"
    >
      <Box fontSize={64} color="text.secondary" mb={2}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
};
```


## 9. Performance Optimization Strategies

### 9.1 Code Splitting

```typescript
// Lazy load route components
import { lazy, Suspense } from 'react';

const ChatView = lazy(() => import('./views/ChatView'));
const BrowseView = lazy(() => import('./views/BrowseView'));
const SearchView = lazy(() => import('./views/SearchView'));
const EventDetailView = lazy(() => import('./views/EventDetailView'));
const ComparisonView = lazy(() => import('./views/ComparisonView'));

// Wrap in Suspense
<Suspense fallback={<LoadingState />}>
  <Routes>
    <Route path="/chat" element={<ChatView />} />
    <Route path="/browse" element={<BrowseView />} />
    {/* ... */}
  </Routes>
</Suspense>
```

### 9.2 Memoization Strategy

```typescript
// Memoize expensive computations
const filteredEvents = useMemo(() => {
  return events.filter((event) => {
    if (filters.location && !event.location.includes(filters.location)) {
      return false;
    }
    if (filters.priceRange.max && event.booth_price_min > filters.priceRange.max) {
      return false;
    }
    return true;
  });
}, [events, filters]);

// Memoize components that receive stable props
export const EventCard = React.memo<EventCardProps>(
  ({ event, onClick, showScore, score }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.event.id === nextProps.event.id &&
           prevProps.score === nextProps.score;
  }
);
```

### 9.3 Debouncing User Input

```typescript
// hooks/useDebounce.ts
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage in filter component
const FilterPanel: React.FC = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const debouncedFilters = useDebounce(localFilters, 300);
  
  useEffect(() => {
    onChange(debouncedFilters);
  }, [debouncedFilters]);
  
  return (
    <TextField
      value={localFilters.location}
      onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
    />
  );
};
```

### 9.4 Virtual Scrolling (for large lists)

```typescript
// For rendering 100+ events efficiently
import { FixedSizeList } from 'react-window';

const EventList: React.FC<{ events: Event[] }> = ({ events }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <EventCard event={events[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={events.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### 9.5 Image Optimization

```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Box position="relative" width={width} height={height}>
      {!loaded && <Skeleton variant="rectangular" width={width} height={height} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          display: loaded ? 'block' : 'none',
          width: '100%',
          height: 'auto',
        }}
      />
    </Box>
  );
};
```

### 9.6 Bundle Size Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'utils': ['axios', 'date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

## 10. Error Handling Architecture

### 10.1 Error Boundary

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {this.state.error?.message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      );
    }
    
    return this.props.children;
  }
}
```

### 10.2 API Error Handling

```typescript
// hooks/useApiCall.ts
export const useApiCall = <T,>(
  apiFunction: () => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError
        ? err
        : new ApiError('An unexpected error occurred');
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, execute };
};
```

### 10.3 Toast Notifications

```typescript
// context/ToastContext.tsx
interface Toast {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (
    message: string,
    severity: Toast['severity'] = 'info',
    duration = 5000
  ) => {
    const id = Math.random().toString(36);
    const toast: Toast = { id, message, severity, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };
  
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toasts.length > 0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Stack spacing={1}>
          {toasts.map((toast) => (
            <Alert
              key={toast.id}
              severity={toast.severity}
              onClose={() => dismissToast(toast.id)}
            >
              {toast.message}
            </Alert>
          ))}
        </Stack>
      </Snackbar>
    </ToastContext.Provider>
  );
};
```


## 11. Accessibility Implementation

### 11.1 ARIA Labels and Roles

```typescript
// Semantic HTML with ARIA attributes
<nav role="navigation" aria-label="Main navigation">
  <Tabs
    value={activeTab}
    onChange={handleTabChange}
    aria-label="Event discovery tabs"
  >
    <Tab
      label="Chat"
      id="tab-chat"
      aria-controls="tabpanel-chat"
      aria-label="Chat with AI assistant"
    />
    <Tab
      label="Browse"
      id="tab-browse"
      aria-controls="tabpanel-browse"
      aria-label="Browse all events"
    />
    <Tab
      label="Search"
      id="tab-search"
      aria-controls="tabpanel-search"
      aria-label="Advanced event search"
    />
  </Tabs>
</nav>

<div
  role="tabpanel"
  id="tabpanel-chat"
  aria-labelledby="tab-chat"
  hidden={activeTab !== 0}
>
  <ChatView />
</div>
```

### 11.2 Keyboard Navigation

```typescript
// components/EventCard.tsx
export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(event);
    }
  };
  
  return (
    <Card
      tabIndex={0}
      onClick={() => onClick?.(event)}
      onKeyPress={handleKeyPress}
      role="button"
      aria-label={`View details for ${event.name}`}
    >
      {/* Card content */}
    </Card>
  );
};
```

### 11.3 Screen Reader Announcements

```typescript
// hooks/useAnnounce.ts
export const useAnnounce = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  return { announce };
};

// Usage
const { announce } = useAnnounce();

useEffect(() => {
  if (searchResults.length > 0) {
    announce(`Found ${searchResults.length} matching events`);
  }
}, [searchResults]);
```

### 11.4 Color Contrast

```typescript
// theme/palette.ts
export const palette = {
  primary: {
    main: '#1976d2',      // Contrast ratio: 4.5:1 (WCAG AA)
    contrastText: '#fff',
  },
  secondary: {
    main: '#dc004e',      // Contrast ratio: 4.5:1 (WCAG AA)
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f',      // Contrast ratio: 4.5:1 (WCAG AA)
    contrastText: '#fff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',    // Contrast ratio: 15.8:1 (WCAG AAA)
    secondary: 'rgba(0, 0, 0, 0.6)',   // Contrast ratio: 7:1 (WCAG AA)
  },
};
```

### 11.5 Focus Management

```typescript
// hooks/useFocusTrap.ts
export const useFocusTrap = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [ref]);
};
```

### 11.6 Skip Links

```typescript
// components/SkipLink.tsx
export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999,
        padding: '1em',
        backgroundColor: '#000',
        color: '#fff',
        textDecoration: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
};
```

## 12. Data Models

### 12.1 TypeScript Interfaces

```typescript
// types/event.ts
export interface Event {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  booth_price_min: number;
  booth_price_max: number;
  booth_sizes: string[];
  amenities: string[];
  expected_visitors: number;
  event_type: string;
  contact_email: string;
  contact_phone?: string;
  images?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// types/search.ts
export interface SearchCriteria {
  location?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  budget?: {
    min: number;
    max: number;
  };
  boothSize?: string;
  eventType?: string;
  naturalLanguage?: string;
}

export interface SearchResult {
  event: Event;
  score: number;
  reasoning: string;
}

// types/chat.ts
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  events?: Event[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  events?: Event[];
}

// types/preference.ts
export interface SavedPreference {
  id: string;
  name: string;
  criteria: SearchCriteria;
  createdAt: Date;
}

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  services: {
    database: string;
    llm: string;
  };
}
```

### 12.2 State Action Types

```typescript
// types/actions.ts
export type AppAction =
  | { type: 'SET_API_HEALTH'; payload: HealthStatus }
  | { type: 'EVENTS_LOADING' }
  | { type: 'EVENTS_LOADED'; payload: Event[] }
  | { type: 'EVENTS_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SearchCriteria> }
  | { type: 'SEARCH_LOADING' }
  | { type: 'SEARCH_SUCCESS'; payload: SearchResult[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'CHAT_MESSAGE_SENT'; payload: Message }
  | { type: 'CHAT_RESPONSE'; payload: Message }
  | { type: 'CHAT_ERROR'; payload: string }
  | { type: 'ADD_TO_COMPARISON'; payload: Event }
  | { type: 'REMOVE_FROM_COMPARISON'; payload: string }
  | { type: 'SAVE_PREFERENCE'; payload: SavedPreference }
  | { type: 'DELETE_PREFERENCE'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: 'chat' | 'browse' | 'search' }
  | { type: 'TOGGLE_MOBILE_MENU' };
```


## 13. Testing Strategy

### 13.1 Unit Testing Approach

```typescript
// __tests__/components/EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '../EventCard';

describe('EventCard', () => {
  const mockEvent: Event = {
    id: '1',
    name: 'Jakarta Food Festival',
    location: 'Jakarta',
    start_date: '2024-03-01',
    end_date: '2024-03-03',
    booth_price_min: 2000000,
    booth_price_max: 5000000,
  };
  
  it('displays event information', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Jakarta Food Festival')).toBeInTheDocument();
    expect(screen.getByText(/Jakarta/)).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<EventCard event={mockEvent} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });
  
  it('displays score when provided', () => {
    render(<EventCard event={mockEvent} showScore score={95} />);
    
    expect(screen.getByText('Match: 95%')).toBeInTheDocument();
  });
});
```

### 13.2 Integration Testing

```typescript
// __tests__/views/BrowseView.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowseView } from '../BrowseView';
import { eventsApi } from '../../api/events';

jest.mock('../../api/events');

describe('BrowseView', () => {
  it('loads and displays events', async () => {
    const mockEvents = [
      { id: '1', name: 'Event 1', location: 'Jakarta' },
      { id: '2', name: 'Event 2', location: 'Bandung' },
    ];
    
    (eventsApi.getAll as jest.Mock).mockResolvedValue(mockEvents);
    
    render(<BrowseView />);
    
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });
  
  it('displays error on API failure', async () => {
    (eventsApi.getAll as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );
    
    render(<BrowseView />);
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to connect/)).toBeInTheDocument();
    });
  });
});
```

### 13.3 Accessibility Testing

```typescript
// __tests__/a11y/EventCard.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EventCard } from '../EventCard';

expect.extend(toHaveNoViolations);

describe('EventCard Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <EventCard event={mockEvent} onClick={() => {}} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('is keyboard navigable', () => {
    const handleClick = jest.fn();
    render(<EventCard event={mockEvent} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    card.focus();
    
    expect(card).toHaveFocus();
    
    fireEvent.keyPress(card, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 13.4 API Mock Setup

```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:5000/api/health', (req, res, ctx) => {
    return res(
      ctx.json({
        status: 'healthy',
        services: {
          database: 'connected',
          llm: 'connected',
        },
      })
    );
  }),
  
  rest.get('http://localhost:5000/api/events/all', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        events: mockEvents,
        total: mockEvents.length,
      })
    );
  }),
  
  rest.post('http://localhost:5000/api/events/search', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        matches: mockSearchResults,
      })
    );
  }),
];
```

## 14. Development Environment Setup

### 14.1 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── events.ts
│   │   ├── chat.ts
│   │   ├── preferences.ts
│   │   ├── health.ts
│   │   ├── cache.ts
│   │   └── errors.ts
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Layout.tsx
│   │   ├── TabNavigation.tsx
│   │   └── ...
│   ├── views/
│   │   ├── ChatView.tsx
│   │   ├── BrowseView.tsx
│   │   ├── SearchView.tsx
│   │   ├── EventDetailView.tsx
│   │   └── ComparisonView.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── reducer.ts
│   ├── hooks/
│   │   ├── useEvents.ts
│   │   ├── useChat.ts
│   │   ├── useFilters.ts
│   │   ├── usePreferences.ts
│   │   ├── useComparison.ts
│   │   ├── useDebounce.ts
│   │   ├── useAnnounce.ts
│   │   └── useResponsive.ts
│   ├── types/
│   │   ├── event.ts
│   │   ├── search.ts
│   │   ├── chat.ts
│   │   ├── preference.ts
│   │   ├── api.ts
│   │   └── actions.ts
│   ├── theme/
│   │   ├── index.ts
│   │   ├── palette.ts
│   │   ├── typography.ts
│   │   ├── breakpoints.ts
│   │   └── components.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── storage.ts
│   ├── routes/
│   │   └── index.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── __tests__/
│   ├── components/
│   ├── views/
│   ├── hooks/
│   ├── a11y/
│   └── mocks/
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

### 14.2 Package.json

```json
{
  "name": "event-matcher-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest-axe": "^8.0.0",
    "msw": "^2.0.0"
  }
}
```

### 14.3 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'utils': ['axios', 'date-fns'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### 14.4 ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

