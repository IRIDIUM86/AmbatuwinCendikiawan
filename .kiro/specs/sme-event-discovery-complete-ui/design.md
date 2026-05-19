# Design Document: SME Event Discovery Complete UI

## Overview

This design document specifies the technical architecture for the complete SME Event Discovery frontend application. The application is a React-based single-page application (SPA) that provides a premium light-mode interface with a split-screen layout featuring event discovery on the left pane and an AI chatbot on the right pane.

### Purpose

The complete UI implementation establishes:
- Premium light mode theme with consistent styling across all components
- Split-screen layout dividing the viewport into event discovery and AI chatbot panes
- Event discovery interface with Supabase integration for fetching and displaying business events
- AI chatbot interface with external API integration for intelligent event recommendations
- Comprehensive error handling, loading states, and user feedback mechanisms
- Responsive design supporting multiple screen sizes
- Accessibility features for inclusive user experience
- Performance optimization for smooth user interactions

### Technology Stack

- **React**: UI library for building component-based interfaces
- **react-router-dom v6**: Client-side routing library
- **Supabase JS Client v2**: Backend-as-a-Service client for event data access
- **Tailwind CSS**: Utility-first CSS framework for premium light mode styling
- **lucide-react**: Icon library for consistent visual elements
- **Create React App**: Build tooling and development environment
- **External AI API**: Third-party API for chatbot message processing and recommendations

### Key Design Decisions

1. **Split-Screen Layout**: 50/50 grid-based layout using CSS Grid (grid-cols-2) for simultaneous event browsing and chatbot interaction
2. **Premium Light Mode**: Consistent use of light gray backgrounds (bg-gray-50), dark gray text (text-gray-900), and vibrant blue accents (bg-blue-600)
3. **Supabase Integration**: Direct client-side queries to Supabase for event data with client-side filtering
4. **External AI API**: Separate API endpoint for chatbot functionality, configured via environment variables
5. **Component-Based Architecture**: Modular components for event cards, modals, chat interface, and filters
6. **State Management**: React hooks (useState, useEffect) for local state management
7. **Error Handling**: Comprehensive error states with user-friendly messages and retry mechanisms
8. **Responsive Design**: Tailwind CSS responsive classes for mobile, tablet, and desktop layouts

## Architecture

### Application Structure

```
src/
├── App.js                           # Main application component with routing
├── supabaseClient.js                # Supabase client configuration
├── components/
│   ├── Navbar.js                   # Navigation bar component
│   ├── EventDiscoveryPane.js        # Event discovery pane container
│   ├── EventCard.js                # Individual event card component
│   ├── EventDetailsModal.js         # Event details modal dialog
│   ├── EventFilter.js              # Event filter controls
│   ├── ChatbotPane.js              # AI chatbot pane container
│   ├── ChatHistory.js              # Chat message history display
│   ├── ChatMessage.js              # Individual chat message component
│   ├── ChatInput.js                # Message input and send controls
│   ├── LoadingIndicator.js         # Loading state spinner/skeleton
│   └── ErrorMessage.js             # Error state display
└── pages/
    ├── EventDiscoveryComplete.js   # Complete UI page with split-screen layout
    ├── Profile.js                  # Profile page component
    └── AIMatchmaker.js             # AI matchmaker page component
```

### Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│  Event Discovery     │      AI Chatbot Pane             │
│  Pane (50%)          │      (50%)                        │
│                      │                                   │
│  ┌────────────────┐  │  ┌──────────────────────────┐   │
│  │ Event Cards    │  │  │ Chat History             │   │
│  │ (scrollable)   │  │  │ (scrollable)             │   │
│  │                │  │  │                          │   │
│  │ ┌────────────┐ │  │  │ ┌──────────────────────┐ │   │
│  │ │ Event Card │ │  │  │ │ User Message (blue)  │ │   │
│  │ └────────────┘ │  │  │ └──────────────────────┘ │   │
│  │                │  │  │                          │   │
│  │ ┌────────────┐ │  │  │ ┌──────────────────────┐ │   │
│  │ │ Event Card │ │  │  │ │ AI Message (gray)    │ │   │
│  │ └────────────┘ │  │  │ └──────────────────────┘ │   │
│  │                │  │  │                          │   │
│  └────────────────┘  │  │ ┌──────────────────────┐ │   │
│                      │  │ │ Message Input        │ │   │
│  ┌────────────────┐  │  │ │ [Text field] [Send]  │ │   │
│  │ Event Filters  │  │  │ └──────────────────────┘ │   │
│  │ (sticky)       │  │  └──────────────────────────┘   │
│  └────────────────┘  │                                   │
│                      │                                   │
└──────────────────────┴──────────────────────────────────┘
```

### Component Hierarchy

```
<BrowserRouter>
  <App>
    <Navbar />
    <Routes>
      <Route path="/" element={<EventDiscoveryComplete />} />
      <Route path="/events" element={<EventDiscoveryComplete />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/matchmaker" element={<AIMatchmaker />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
</BrowserRouter>

<EventDiscoveryComplete>
  <div className="grid grid-cols-2">
    <EventDiscoveryPane>
      <EventFilter />
      <div className="scrollable">
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
      <EventDetailsModal>
        [Event details and Apply button]
      </EventDetailsModal>
    </EventDiscoveryPane>
    
    <ChatbotPane>
      <ChatHistory>
        <ChatMessage />
        <ChatMessage />
      </ChatHistory>
      <ChatInput />
    </ChatbotPane>
  </div>
</EventDiscoveryComplete>
```

### Data Flow Architecture

```
Event Discovery Flow:
1. EventDiscoveryPane mounts
2. useEffect triggers Supabase query
3. Fetch all events from bazaar_events_Table
4. Store events in component state
5. Render EventCards with event data
6. User clicks EventCard
7. Display EventDetailsModal with full event details
8. User clicks "Apply as Vendor"
9. Send vendor application to backend
10. Display success/error message

Chat Flow:
1. User types message in ChatInput
2. User clicks Send or presses Enter
3. Add message to ChatHistory immediately
4. Display LoadingIndicator
5. Send message to AI_API via POST request
6. AI_API processes and returns response
7. Add AI response to ChatHistory
8. Remove LoadingIndicator
9. Auto-scroll to latest message

Filter Flow:
1. User selects filter option (type or location)
2. Update filter state
3. Re-render EventCards with filtered data
4. User clears filters
5. Display all events again
```

### Supabase Integration

**Database Table**: `bazaar_events_Table`

**Query Pattern**:
```javascript
// Fetch all events
const { data, error } = await supabase
  .from('bazaar_events_Table')
  .select('*')

// Filter by type
const { data, error } = await supabase
  .from('bazaar_events_Table')
  .select('*')
  .eq('event_type', selectedType)

// Filter by location
const { data, error } = await supabase
  .from('bazaar_events_Table')
  .select('*')
  .eq('city', selectedCity)
  .eq('state', selectedState)
```

**Fields Retrieved**:
- event_name: string
- event_type: string
- description: string
- city: string
- state: string
- venue_name: string
- event_date: date
- start_time: time
- end_time: time
- target_industries: array/string
- target_audience: string
- expected_footfall: number
- cover_image_url: string
- status: string (upcoming, ongoing, completed)
- is_featured: boolean

### External AI API Integration

**API Endpoint**: Configured via `process.env.REACT_APP_AI_API_URL`

**Request Pattern**:
```javascript
const response = await fetch(process.env.REACT_APP_AI_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Include authentication headers if required
  },
  body: JSON.stringify({
    message: userMessage,
    // Include conversation context if needed
  })
})
```

**Response Pattern**:
```javascript
{
  "response": "AI-generated message text",
  // Additional fields as needed
}
```

**Error Handling**:
- HTTP 4xx/5xx responses → Display error message
- Network errors → Display network error message
- Timeout errors → Display timeout message
- Malformed/empty response → Display error message

## Components and Interfaces

### Navbar Component

**Purpose**: Persistent navigation across all pages with logo and user profile

**Props**: None (stateless component)

**State**: None

**Rendering**:
- Fixed or sticky positioning at top of viewport
- Logo/platform name on left
- Navigation links (Dashboard, My Applications, Opportunities) in center
- User profile avatar on right
- Premium light mode styling (light background, dark text, shadow-md)

**Implementation Pattern**:
```jsx
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">SME Bazaar</div>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/applications" className="text-gray-600 hover:text-gray-900">
            My Applications
          </Link>
          <Link to="/opportunities" className="text-gray-600 hover:text-gray-900">
            Opportunities
          </Link>
        </div>
        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <User size={20} />
        </button>
      </div>
    </nav>
  )
}
```

### EventDiscoveryPane Component

**Purpose**: Container for event browsing, filtering, and details modal

**Props**: None

**State**:
- `events`: Array of event objects from Supabase
- `filteredEvents`: Array of events after applying filters
- `selectedEvent`: Currently selected event for modal display
- `showModal`: Boolean indicating if modal is open
- `loading`: Boolean indicating if events are being fetched
- `error`: Error message if fetch fails
- `filters`: Object containing active filters (type, location)

**Lifecycle**:
- On mount: Fetch events from Supabase
- On filter change: Re-filter events
- On event card click: Set selectedEvent and show modal
- On modal close: Clear selectedEvent and hide modal

**Rendering**:
- LoadingIndicator while fetching
- ErrorMessage with retry button if fetch fails
- EventFilter component (sticky at bottom)
- Grid of EventCard components (scrollable)
- EventDetailsModal when event selected

### EventCard Component

**Purpose**: Display event summary information

**Props**:
- `event`: Event object with all fields
- `onSelect`: Callback function when card is clicked

**State**: None

**Rendering**:
- Event cover image (with fallback placeholder)
- Event name (heading)
- Event date (formatted)
- Event location (city, state)
- Event type (badge)
- Featured indicator (if is_featured is true)
- Status badge (color-coded by status)
- Premium light mode styling (light background, shadow-md, rounded-xl)

**Implementation Pattern**:
```jsx
export default function EventCard({ event, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(event)}
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <img 
        src={event.cover_image_url || '/placeholder.png'} 
        alt={event.event_name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.event_name}</h3>
      <p className="text-sm text-gray-600 mb-2">{event.event_date}</p>
      <p className="text-sm text-gray-600 mb-3">{event.city}, {event.state}</p>
      <div className="flex gap-2">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {event.event_type}
        </span>
        {event.is_featured && (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
    </div>
  )
}
```

### EventDetailsModal Component

**Purpose**: Display complete event information and vendor application button

**Props**:
- `event`: Event object with all fields
- `isOpen`: Boolean indicating if modal is visible
- `onClose`: Callback function when modal closes
- `onApply`: Callback function when Apply button clicked

**State**:
- `applying`: Boolean indicating if application is in progress
- `applicationError`: Error message if application fails
- `applicationSuccess`: Boolean indicating successful application

**Rendering**:
- Modal overlay with semi-transparent background
- Event cover image
- Event name, description, date/time, location, venue
- Event type, target industries, target audience, expected footfall
- Apply as Vendor button
- Close button (X icon)
- Premium light mode styling (light background, shadow-md, rounded-xl)

**Implementation Pattern**:
```jsx
export default function EventDetailsModal({ event, isOpen, onClose, onApply }) {
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen || !event) return null

  const handleApply = async () => {
    setApplying(true)
    setError(null)
    try {
      await onApply(event)
    } catch (err) {
      setError(err.message)
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl max-h-96 overflow-y-auto">
        <button 
          onClick={onClose}
          className="float-right text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        
        <img 
          src={event.cover_image_url} 
          alt={event.event_name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.event_name}</h2>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Date & Time</p>
            <p className="text-gray-600">{event.event_date}</p>
            <p className="text-gray-600">{event.start_time} - {event.end_time}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Location</p>
            <p className="text-gray-600">{event.venue_name}</p>
            <p className="text-gray-600">{event.city}, {event.state}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900">Target Industries</p>
          <p className="text-gray-600">{event.target_industries}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900">Expected Footfall</p>
          <p className="text-gray-600">{event.expected_footfall || 'TBD'}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button 
          onClick={handleApply}
          disabled={applying}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {applying ? 'Applying...' : 'Apply as Vendor'}
        </button>
      </div>
    </div>
  )
}
```

### EventFilter Component

**Purpose**: Sticky filter controls for event type and location

**Props**:
- `onFilterChange`: Callback function when filters change
- `availableTypes`: Array of unique event types
- `availableLocations`: Array of unique locations

**State**:
- `selectedType`: Currently selected event type filter
- `selectedLocation`: Currently selected location filter

**Rendering**:
- Sticky positioned at bottom of pane
- Dropdown/select for event type
- Dropdown/select for location
- Clear filters button
- Premium light mode styling

**Implementation Pattern**:
```jsx
export default function EventFilter({ onFilterChange, availableTypes, availableLocations }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleTypeChange = (type) => {
    setSelectedType(type)
    onFilterChange({ type, location: selectedLocation })
  }

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    onFilterChange({ type: selectedType, location })
  }

  const handleClear = () => {
    setSelectedType('')
    setSelectedLocation('')
    onFilterChange({ type: '', location: '' })
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-t-xl shadow-md">
      <div className="grid grid-cols-3 gap-4">
        <select 
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-gray-900"
        >
          <option value="">All Types</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select 
          value={selectedLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-gray-900"
        >
          <option value="">All Locations</option>
          {availableLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <button 
          onClick={handleClear}
          className="px-3 py-2 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
```

### ChatbotPane Component

**Purpose**: Container for AI chatbot interface

**Props**: None

**State**:
- `messages`: Array of chat messages (user and AI)
- `loading`: Boolean indicating if AI is processing
- `error`: Error message if API call fails

**Lifecycle**:
- On mount: Initialize empty chat history
- On message send: Add user message, call AI API, add AI response
- On error: Display error message

**Rendering**:
- ChatHistory component (scrollable)
- ChatInput component
- Premium light mode styling

### ChatHistory Component

**Purpose**: Display all messages in conversation

**Props**:
- `messages`: Array of message objects
- `loading`: Boolean indicating if AI is processing

**State**: None

**Rendering**:
- Scrollable container
- ChatMessage components for each message
- LoadingIndicator if loading is true
- Auto-scroll to latest message

**Implementation Pattern**:
```jsx
export default function ChatHistory({ messages, loading }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}
      {loading && <LoadingIndicator />}
      <div ref={endRef} />
    </div>
  )
}
```

### ChatMessage Component

**Purpose**: Display individual chat message

**Props**:
- `message`: Message object with { role, text, timestamp }

**State**: None

**Rendering**:
- User messages: Blue bubble (bg-blue-600), right-aligned, white text
- AI messages: Gray bubble (bg-gray-200), left-aligned, dark text
- Timestamp or order indicator
- Premium light mode styling (rounded-xl, shadow-md)

**Implementation Pattern**:
```jsx
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs px-4 py-2 rounded-xl shadow-md ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p>{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
```

### ChatInput Component

**Purpose**: Message input field and send button

**Props**:
- `onSend`: Callback function when message is sent
- `disabled`: Boolean indicating if input is disabled

**State**:
- `inputValue`: Current text in input field

**Rendering**:
- Text input field (multi-line capable)
- Send button
- Character count indicator
- Premium light mode styling

**Implementation Pattern**:
```jsx
export default function ChatInput({ onSend, disabled }) {
  const [inputValue, setInputValue] = useState('')
  const MAX_CHARS = 1000

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-gray-900 resize-none"
          rows="3"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {inputValue.length}/{MAX_CHARS}
      </p>
    </div>
  )
}
```

### LoadingIndicator Component

**Purpose**: Visual feedback during async operations

**Props**:
- `message`: Optional custom loading message

**State**: None

**Rendering**:
- Spinner animation or skeleton loader
- Loading message ("Loading...", "Processing...", etc.)
- Premium light mode styling

### ErrorMessage Component

**Purpose**: Display error information with retry option

**Props**:
- `error`: Error message text
- `onRetry`: Callback function for retry button

**State**: None

**Rendering**:
- Error icon
- Error message text
- Retry button
- Premium light mode styling (red/orange accent for errors)

## Data Models

### Event Model

```typescript
interface Event {
  id: string                    // Unique identifier
  event_name: string           // Event name
  event_type: string           // Type of event
  description: string          // Event description
  city: string                 // City location
  state: string                // State location
  venue_name: string           // Venue name
  event_date: string           // Date (ISO format)
  start_time: string           // Start time
  end_time: string             // End time
  target_industries: string    // Target industries (comma-separated or array)
  target_audience: string      // Target audience description
  expected_footfall: number    // Expected number of attendees
  cover_image_url: string      // URL to event cover image
  status: string               // Status: "upcoming", "ongoing", "completed"
  is_featured: boolean         // Whether event is featured
}
```

### Chat Message Model

```typescript
interface ChatMessage {
  id: string                   // Unique identifier
  role: 'user' | 'ai'         // Message sender
  text: string                 // Message content
  timestamp: Date              // When message was sent
}
```

### Filter State Model

```typescript
interface FilterState {
  type: string                 // Selected event type (empty = all)
  location: string             // Selected location (empty = all)
}
```

### Application State Model

```typescript
interface EventDiscoveryState {
  events: Event[]              // All fetched events
  filteredEvents: Event[]      // Events after filtering
  selectedEvent: Event | null  // Currently selected event
  showModal: boolean           // Modal visibility
  loading: boolean             // Fetch loading state
  error: string | null         // Error message
  filters: FilterState         // Active filters
}

interface ChatbotState {
  messages: ChatMessage[]      // Chat history
  loading: boolean             // API processing state
  error: string | null         // Error message
}
```

### Environment Configuration

```typescript
interface EnvironmentConfig {
  REACT_APP_SUPABASE_URL: string           // Supabase project URL
  REACT_APP_SUPABASE_ANON_KEY: string      // Supabase anonymous key
  REACT_APP_AI_API_URL: string             // External AI API endpoint
}
```

## Error Handling

### Event Fetching Errors

**Scenario**: Supabase query fails

**Handling**:
- Catch error in useEffect
- Set error state with user-friendly message
- Display ErrorMessage component with retry button
- Retry button re-triggers fetch

**Error Messages**:
- "Failed to load events. Please try again."
- "Network error. Please check your connection."
- "Unable to connect to the server."

### Event Details Modal Errors

**Scenario**: Vendor application submission fails

**Handling**:
- Catch error in onApply handler
- Set applicationError state
- Display error message in modal
- Keep modal open for user to see error
- Allow user to retry or close modal

**Error Messages**:
- "Failed to submit application. Please try again."
- "Validation error: [specific field]"
- "You have already applied for this event."

### AI API Errors

**Scenario**: Chat message API call fails

**Handling**:
- Catch error in message send handler
- Set error state
- Display ErrorMessage component in chat
- Clear loading state
- Allow user to retry sending message

**Error Scenarios**:
- HTTP 4xx/5xx responses → "Failed to send message. Please try again."
- Network error → "Network error. Please check your connection."
- Timeout → "Request timed out. Please try again."
- Malformed response → "Invalid response from server."
- Empty response → "No response from server."

**Error Message Display**:
- In chat history as system message
- In red/orange color for visibility
- With timestamp for context

### Input Validation Errors

**Scenario**: User sends empty message

**Handling**:
- Disable Send button when input is empty
- Prevent API call if input is empty
- Show character count indicator

**Scenario**: Missing environment variables

**Handling**:
- Check for REACT_APP_AI_API_URL on component mount
- Display error message if not configured
- Disable chat functionality

## Testing Strategy

### Assessment of Property-Based Testing Applicability

This feature involves:
1. **UI component rendering** - React components with Tailwind CSS styling
2. **Data fetching and filtering** - Supabase queries and client-side filtering
3. **External API integration** - Chat message processing
4. **State management** - React hooks for local state
5. **User interactions** - Click handlers, form submissions

**PBT Applicability Analysis**:

- **Event filtering logic**: Could be tested with property-based testing (universal properties about filter behavior)
- **Chat message handling**: Could be tested with property-based testing (message ordering, persistence)
- **UI rendering**: Better suited for snapshot tests and example-based tests
- **API integration**: Better suited for integration tests with mocks
- **Error handling**: Better suited for example-based tests with specific error scenarios

**Decision**: **PBT IS APPLICABLE** for core business logic (filtering, message handling) but NOT for UI rendering and API integration.

### Acceptance Criteria Testing Prework

Acceptance Criteria Testing Prework:

1.1 THE Frontend_Application SHALL use a light gray background color (bg-gray-50) for the main viewport
  Thoughts: This is a styling requirement that should hold for all rendered pages. We can test this by rendering the app and checking that the background color is applied.
  Classification: EXAMPLE
  Test Strategy: Render the application and verify the main viewport has bg-gray-50 class applied

1.2 THE Frontend_Application SHALL use dark gray text color (text-gray-900) for all heading elements
  Thoughts: This is a styling requirement that should apply to all headings. We can test by rendering headings and verifying the color class.
  Classification: EXAMPLE
  Test Strategy: Render heading elements and verify text-gray-900 class is applied

2.1 THE Navigation_Bar SHALL be positioned at the top of the viewport and remain visible when scrolling
  Thoughts: This is a positioning requirement. We can test by rendering the navbar and verifying it has sticky/fixed positioning.
  Classification: EXAMPLE
  Test Strategy: Render navbar and verify sticky/fixed positioning class

3.1 THE Frontend_Application SHALL divide the main content area into two equal columns using CSS Grid (grid-cols-2)
  Thoughts: This is a layout requirement. We can test by rendering the split-screen layout and verifying grid-cols-2 is applied.
  Classification: EXAMPLE
  Test Strategy: Render split-screen layout and verify grid-cols-2 class

4.1 EACH Event_Card SHALL display the following information: Event image, name, date, location, type
  Thoughts: This is a rendering requirement. We can test by rendering an event card with sample data and verifying all fields are displayed.
  Classification: PROPERTY
  Test Strategy: For any event object with all required fields, rendering the card should display all fields

5.1 WHEN the Event_Discovery_Pane component mounts, THE Frontend_Application SHALL fetch all events from the bazaar_events_Table
  Thoughts: This is a data fetching requirement. We can test by mocking Supabase and verifying the query is called on mount.
  Classification: EXAMPLE
  Test Strategy: Mock Supabase, mount component, verify query is called

6.1 WHEN a user clicks an Event_Card, THE Frontend_Application SHALL display an Event_Details_Modal
  Thoughts: This is a UI interaction requirement. We can test by clicking a card and verifying the modal appears.
  Classification: EXAMPLE
  Test Strategy: Render card, click it, verify modal is displayed

7.1 WHEN a user selects an Event_Type filter, THE Frontend_Application SHALL filter the displayed Event_Cards to show only events matching the selected type
  Thoughts: This is a filtering requirement that should hold for all event types. We can generate random events and filter types and verify only matching events are shown.
  Classification: PROPERTY
  Test Strategy: For any set of events and any filter type, filtering should return only events matching that type

8.1 THE AI_Chatbot_Pane SHALL display a full-height chat interface
  Thoughts: This is a layout requirement. We can test by rendering the pane and verifying it fills the available height.
  Classification: EXAMPLE
  Test Strategy: Render chatbot pane and verify full-height styling

9.1 WHEN a user sends a message, THE Frontend_Application SHALL make a POST request to the AI_API endpoint
  Thoughts: This is an API integration requirement. We can test by mocking the API and verifying the POST request is made.
  Classification: EXAMPLE
  Test Strategy: Mock AI API, send message, verify POST request is made with correct payload

10.1 EACH User_Message SHALL be displayed in a blue bubble (bg-blue-600) aligned to the right side
  Thoughts: This is a rendering requirement. We can test by rendering a user message and verifying the styling.
  Classification: EXAMPLE
  Test Strategy: Render user message and verify bg-blue-600 and right alignment

11.1 WHEN a user clicks the 'Send' button, THE Frontend_Application SHALL send the message text to the AI_API
  Thoughts: This is a UI interaction requirement. We can test by clicking send and verifying the API call.
  Classification: EXAMPLE
  Test Strategy: Mock API, click send, verify API call is made

12.1 WHEN the Event_Discovery_Pane is fetching events from Supabase, THE Frontend_Application SHALL replace existing event content entirely with a Loading_State indicator
  Thoughts: This is a loading state requirement. We can test by mocking a slow Supabase query and verifying the loading indicator appears.
  Classification: EXAMPLE
  Test Strategy: Mock slow Supabase query, verify loading indicator is displayed

13.1 IF the Supabase fetch operation fails, THE Frontend_Application SHALL display an Error_State message in the Event_Discovery_Pane
  Thoughts: This is an error handling requirement. We can test by mocking a failed Supabase query and verifying the error message.
  Classification: EXAMPLE
  Test Strategy: Mock failed Supabase query, verify error message is displayed

14.1 THE Frontend_Application SHALL read the AI_API_URL from the environment variable REACT_APP_AI_API_URL
  Thoughts: This is a configuration requirement. We can test by setting/not setting the env var and verifying the app reads it correctly.
  Classification: EXAMPLE
  Test Strategy: Test with and without env var set, verify correct behavior

15.1 ON desktop screens (1024px and above), THE Split_Screen_Layout SHALL display both panes side-by-side
  Thoughts: This is a responsive design requirement. We can test by rendering at desktop width and verifying both panes are visible.
  Classification: EXAMPLE
  Test Strategy: Render at desktop width, verify both panes are displayed side-by-side

16.1 WHEN a user clicks the 'Apply as Vendor' button in the Event_Details_Modal, THE Frontend_Application SHALL process the vendor application
  Thoughts: This is a form submission requirement. We can test by clicking the button and verifying the application is processed.
  Classification: EXAMPLE
  Test Strategy: Mock backend, click apply button, verify application is submitted

17.1 THE Navigation_Bar SHALL display a User_Profile_Avatar on the right side
  Thoughts: This is a rendering requirement. We can test by rendering the navbar and verifying the avatar is displayed.
  Classification: EXAMPLE
  Test Strategy: Render navbar and verify avatar is displayed

18.1 THE Frontend_Application SHALL store all Chat_Messages in component state or local storage
  Thoughts: This is a state management requirement. We can test by sending messages and verifying they are stored.
  Classification: PROPERTY
  Test Strategy: For any sequence of messages, all messages should be stored and retrievable

19.1 WHEN an event has is_featured set to true, THE Event_Card SHALL display a visual indicator (badge, star, or highlight)
  Thoughts: This is a conditional rendering requirement. We can test by rendering featured and non-featured events and verifying the indicator appears only for featured events.
  Classification: PROPERTY
  Test Strategy: For any event with is_featured=true, the card should display a featured indicator; for is_featured=false, no indicator

20.1 EACH Event_Card SHALL display the event status (from the status field)
  Thoughts: This is a rendering requirement. We can test by rendering cards with different statuses and verifying the status is displayed.
  Classification: PROPERTY
  Test Strategy: For any event with a status value, the card should display that status

21.1 EACH Event_Card SHALL display the event cover image (from cover_image_url field)
  Thoughts: This is a rendering requirement. We can test by rendering a card and verifying the image is displayed or placeholder is shown.
  Classification: PROPERTY
  Test Strategy: For any event with a cover_image_url, the card should display the image; if missing, display placeholder

22.1 EACH Event_Card SHALL display the event type (from event_type field)
  Thoughts: This is a rendering requirement. We can test by rendering cards and verifying the type is displayed.
  Classification: PROPERTY
  Test Strategy: For any event with an event_type, the card should display that type

23.1 EACH Event_Card SHALL display the event date (from event_date field)
  Thoughts: This is a rendering requirement. We can test by rendering cards and verifying the date is displayed.
  Classification: PROPERTY
  Test Strategy: For any event with an event_date, the card should display that date

24.1 THE Event_Details_Modal SHALL display the venue name (from venue_name field)
  Thoughts: This is a rendering requirement. We can test by opening the modal and verifying the venue name is displayed.
  Classification: PROPERTY
  Test Strategy: For any event with a venue_name, the modal should display it

25.1 THE Event_Details_Modal SHALL display the target industries (from target_industries field)
  Thoughts: This is a rendering requirement. We can test by opening the modal and verifying target industries are displayed.
  Classification: PROPERTY
  Test Strategy: For any event with target_industries, the modal should display them

26.1 THE Event_Details_Modal SHALL display the expected footfall (from expected_footfall field)
  Thoughts: This is a rendering requirement with a special case (zero should display 'TBD'). We can test by opening the modal with various footfall values.
  Classification: PROPERTY
  Test Strategy: For any event with expected_footfall > 0, display the number; for 0 or missing, display 'TBD'

27.1 THE Event_Details_Modal SHALL display the event description (from description field)
  Thoughts: This is a rendering requirement. We can test by opening the modal and verifying the description is displayed.
  Classification: PROPERTY
  Test Strategy: For any event with a description, the modal should display it

28.1 ALL interactive elements (buttons, links, input fields) SHALL have proper ARIA labels or descriptive text
  Thoughts: This is an accessibility requirement. We can test by rendering interactive elements and verifying ARIA labels are present.
  Classification: EXAMPLE
  Test Strategy: Render interactive elements and verify ARIA labels are present

29.1 THE Frontend_Application SHALL lazy-load Event_Cards as the user scrolls through the Event_Discovery_Pane
  Thoughts: This is a performance optimization requirement. We can test by rendering many cards and verifying only visible ones are rendered.
  Classification: EXAMPLE
  Test Strategy: Render large list of cards, verify only visible cards are in DOM

30.1 WHEN fetching events from Supabase, THE Frontend_Application SHALL validate that all required fields are present
  Thoughts: This is a data validation requirement. We can test by providing events with missing fields and verifying they are handled correctly.
  Classification: PROPERTY
  Test Strategy: For any event from Supabase, if required fields are missing, the event should be skipped or error should be displayed

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Event Filtering by Type

*For any* set of events and any selected event type, filtering should return only events where the event_type matches the selected type.

**Validates: Requirements 7.1**

### Property 2: Event Filtering by Location

*For any* set of events and any selected location (city/state combination), filtering should return only events matching that location.

**Validates: Requirements 7.1**

### Property 3: Featured Event Indicator Display

*For any* event where is_featured is true, the event card should display a featured indicator; for events where is_featured is false, no featured indicator should be displayed.

**Validates: Requirements 19.1**

### Property 4: Event Status Display

*For any* event with a status value (upcoming, ongoing, completed), the event card should display that status in a badge or label.

**Validates: Requirements 20.1**

### Property 5: Event Image Display with Fallback

*For any* event with a valid cover_image_url, the event card should display that image; for events without a valid URL, a placeholder image should be displayed.

**Validates: Requirements 21.1**

### Property 6: Event Card Information Completeness

*For any* event object with all required fields, rendering the event card should display the event name, date, location, and type.

**Validates: Requirements 4.1, 22.1, 23.1**

### Property 7: Chat Message Storage and Retrieval

*For any* sequence of user and AI messages, all messages should be stored in component state and retrievable in chronological order.

**Validates: Requirements 18.1**

### Property 8: Event Details Modal Field Display

*For any* event with complete information, opening the event details modal should display all fields: name, description, date/time, location, venue, type, target industries, target audience, and expected footfall.

**Validates: Requirements 24.1, 25.1, 26.1, 27.1**

### Property 9: Expected Footfall Display

*For any* event with expected_footfall > 0, the modal should display the number; for events with expected_footfall = 0 or missing, the modal should display 'TBD'.

**Validates: Requirements 26.1**

### Property 10: Event Data Validation

*For any* event fetched from Supabase, if required fields are missing, the event should either be skipped from display or an error should be displayed to the user.

**Validates: Requirements 30.1**

## Testing Strategy

### Unit Testing

**Event Filtering Logic**:
- Test filtering by event type with various event datasets
- Test filtering by location with various location combinations
- Test clearing filters returns all events
- Test multiple filters applied together (AND logic)

**Event Card Rendering**:
- Test event card displays all required fields
- Test featured indicator appears only for featured events
- Test status badge displays correct status
- Test image displays or placeholder shows for missing images

**Chat Message Handling**:
- Test messages are added to history in correct order
- Test user and AI messages are distinguished correctly
- Test message timestamps are recorded
- Test chat history persists during session

**Event Details Modal**:
- Test all event fields are displayed in modal
- Test expected footfall displays 'TBD' when zero
- Test modal closes when close button clicked
- Test modal displays error when application fails

**Input Validation**:
- Test empty messages are not sent
- Test character limit is enforced
- Test required event fields are validated

### Integration Testing

**Supabase Integration**:
- Mock Supabase client
- Test events are fetched on component mount
- Test failed fetch displays error message
- Test retry button re-triggers fetch

**AI API Integration**:
- Mock AI API endpoint
- Test message is sent with correct payload
- Test response is displayed in chat
- Test failed API call displays error message
- Test timeout displays timeout error

**Vendor Application**:
- Mock backend endpoint
- Test application is submitted when button clicked
- Test success message displays
- Test error message displays on failure

### Component Testing

**EventDiscoveryPane**:
- Test component mounts and fetches events
- Test events are displayed as cards
- Test filter controls work correctly
- Test modal opens when card clicked
- Test modal closes when close button clicked

**ChatbotPane**:
- Test chat history displays messages
- Test input field accepts text
- Test send button sends message
- Test loading indicator appears during API call
- Test error message displays on API failure

**Navbar**:
- Test navigation links are present
- Test links navigate to correct pages
- Test user avatar is displayed
- Test sticky positioning works

### Property-Based Testing

**Event Filtering Properties**:
- Generate random event datasets with various types and locations
- Generate random filter selections
- Verify filtered results contain only matching events
- Verify no non-matching events are included

**Event Card Display Properties**:
- Generate random event objects
- Verify all fields are rendered correctly
- Verify featured indicator appears only when appropriate
- Verify status badges display correct values

**Chat Message Properties**:
- Generate random sequences of user and AI messages
- Verify all messages are stored
- Verify messages are in correct order
- Verify user and AI messages are distinguished

**Event Details Modal Properties**:
- Generate random event objects with various field values
- Verify all fields are displayed
- Verify expected footfall displays correctly (number or 'TBD')
- Verify modal can be opened and closed

### Test Configuration

- **Minimum 100 iterations** per property-based test
- **Jest** as test runner
- **React Testing Library** for component testing
- **Vitest** or **fast-check** for property-based testing
- **Mock Supabase client** for data fetching tests
- **Mock AI API** for chatbot tests

### Coverage Goals

- **Unit Tests**: 80%+ coverage for component logic
- **Integration Tests**: All critical user flows (event browsing, filtering, chatting, applying)
- **Property Tests**: All universal properties about filtering, display, and message handling
- **Accessibility Tests**: ARIA labels, keyboard navigation, color contrast


