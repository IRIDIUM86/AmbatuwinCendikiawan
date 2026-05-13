# Design Document: SME Event Discovery Frontend Foundation

## Overview

This design document specifies the technical architecture for the SME Event Discovery frontend foundation. The application is a React-based single-page application (SPA) that provides the foundational structure for an event discovery platform targeting small and medium enterprises (SMEs).

### Purpose

The frontend foundation establishes:
- Client-side routing infrastructure using react-router-dom
- Supabase client configuration for backend connectivity
- Basic page components (Profile, Event Discovery, AI Matchmaker)
- Navigation structure with persistent navigation bar
- Environment-based configuration management
- Tailwind CSS styling foundation

### Technology Stack

- **React**: UI library for building component-based interfaces
- **react-router-dom v6**: Client-side routing library
- **Supabase JS Client v2**: Backend-as-a-Service client for authentication and data access
- **Tailwind CSS**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent visual elements
- **Create React App**: Build tooling and development environment

### Key Design Decisions

1. **Client-Side Routing**: Using react-router-dom v6 for SPA navigation without full page reloads
2. **Environment Variables**: Supabase credentials stored in environment variables following Create React App conventions (REACT_APP_ prefix)
3. **Fallback Configuration**: Placeholder values for missing environment variables to enable development without immediate Supabase setup
4. **Component Structure**: Separate page components for each major section (Profile, Events, Matchmaker)
5. **Icon-Based Navigation**: Using lucide-react icons for visual clarity in navigation

## Architecture

### Application Structure

```
src/
├── App.js                    # Main application component with routing
├── supabaseClient.js         # Supabase client configuration
├── components/
│   └── Navbar.js            # Navigation bar component
└── pages/
    ├── Profile.js           # Profile page component
    ├── EventDiscovery.js    # Event discovery page component
    └── AIMatchmaker.js      # AI matchmaker page component
```

### Routing Architecture

The application uses a flat routing structure with three main routes:

- `/` → Event Discovery Page (default/home)
- `/events` → Event Discovery Page (alias)
- `/profile` → Profile Page
- `/matchmaker` → AI Matchmaker Page
- `*` → Not Found Page (catch-all)

**Routing Flow:**
```
User clicks navigation link
  ↓
react-router-dom intercepts navigation
  ↓
URL updates without page reload
  ↓
Router matches path to route configuration
  ↓
Corresponding page component renders
  ↓
Navbar remains mounted (persistent)
```

### Component Hierarchy

```
<BrowserRouter>
  <App>
    <Navbar />
    <Routes>
      <Route path="/" element={<EventDiscovery />} />
      <Route path="/events" element={<EventDiscovery />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/matchmaker" element={<AIMatchmaker />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
</BrowserRouter>
```

### Supabase Client Configuration

The Supabase client is initialized once and exported as a singleton:

```javascript
// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || supabaseUrl === '') {
  throw new Error('Supabase URL is required')
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  throw new Error('Supabase Anon Key is required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Configuration Flow:**
1. Read environment variables (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY)
2. Apply fallback placeholder values if environment variables are missing
3. Validate that final values are non-empty strings
4. Initialize Supabase client with createClient()
5. Export singleton instance for application-wide use

## Components and Interfaces

### Navbar Component

**Purpose**: Provides persistent navigation across all pages

**Props**: None (stateless component)

**Rendering**:
- Fixed or sticky positioning at top of viewport
- Three navigation links with icons and labels
- Tailwind CSS styling for responsive layout

**Navigation Links**:
1. Profile: `/profile` (User icon from lucide-react)
2. Event Discovery: `/events` (Calendar icon from lucide-react)
3. AI Matchmaker: `/matchmaker` (Sparkles icon from lucide-react)

**Implementation Pattern**:
```jsx
import { User, Calendar, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex gap-6">
        <Link to="/profile" className="flex items-center gap-2">
          <User size={20} />
          <span>Profile</span>
        </Link>
        <Link to="/events" className="flex items-center gap-2">
          <Calendar size={20} />
          <span>Event Discovery</span>
        </Link>
        <Link to="/matchmaker" className="flex items-center gap-2">
          <Sparkles size={20} />
          <span>AI Matchmaker</span>
        </Link>
      </div>
    </nav>
  )
}
```

### Profile Page Component

**Purpose**: Displays user profile information (foundation only - no data fetching yet)

**Props**: None

**Rendering**:
- Container with heading "Profile"
- Tailwind CSS styling for layout
- Placeholder for future profile content

**Implementation Pattern**:
```jsx
export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
    </div>
  )
}
```

### Event Discovery Page Component

**Purpose**: Displays event browsing interface (foundation only - no data fetching yet)

**Props**: None

**Rendering**:
- Container with heading "Event Discovery"
- Tailwind CSS styling for layout
- Placeholder for future event list/search

**Implementation Pattern**:
```jsx
export default function EventDiscovery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Event Discovery</h1>
    </div>
  )
}
```

### AI Matchmaker Page Component

**Purpose**: Displays AI-powered event recommendations (foundation only - no AI integration yet)

**Props**: None

**Rendering**:
- Container with heading "AI Matchmaker"
- Tailwind CSS styling for layout
- Placeholder for future recommendation engine

**Implementation Pattern**:
```jsx
export default function AIMatchmaker() {
  return (
    <div className="container mx-auto px-auto px-4 py-8">
      <h1 className="text-3xl font-bold">AI Matchmaker</h1>
    </div>
  )
}
```

### Not Found Page Component

**Purpose**: Displays 404 error for undefined routes

**Props**: None

**Rendering**:
- Container with "404 Not Found" message
- Link back to home page
- Tailwind CSS styling

**Implementation Pattern**:
```jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  )
}
```

### App Component

**Purpose**: Main application component that orchestrates routing and layout

**Structure**:
- Wraps application in BrowserRouter
- Renders Navbar (persistent across routes)
- Defines Routes with route configurations
- Applies global Tailwind CSS layout classes

**Implementation Pattern**:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import EventDiscovery from './pages/EventDiscovery'
import AIMatchmaker from './pages/AIMatchmaker'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<EventDiscovery />} />
          <Route path="/events" element={<EventDiscovery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matchmaker" element={<AIMatchmaker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

## Data Models

### Environment Configuration

The application uses environment variables for configuration:

```typescript
interface EnvironmentConfig {
  REACT_APP_SUPABASE_URL: string      // Supabase project URL
  REACT_APP_SUPABASE_ANON_KEY: string // Supabase anonymous key
}
```

**Default Values** (for development without .env file):
- `REACT_APP_SUPABASE_URL`: `"https://your-project.supabase.co"`
- `REACT_APP_SUPABASE_ANON_KEY`: `"your-anon-key"`

**Validation Rules**:
- Both values must be non-empty strings after fallback resolution
- Empty strings after fallback trigger error: "Supabase URL is required" or "Supabase Anon Key is required"

### Package Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0",
    "lucide-react": "^0.263.0",
    "react-router-dom": "^6.0.0"
  }
}
```

**Version Constraints**:
- Minimum versions specified with caret (^) for compatible updates
- @supabase/supabase-js: v2.x (major version 2)
- lucide-react: v0.263.x or higher
- react-router-dom: v6.x (major version 6)

### Route Configuration Model

```typescript
interface RouteConfig {
  path: string           // URL path pattern
  element: JSX.Element   // React component to render
}

const routes: RouteConfig[] = [
  { path: '/', element: <EventDiscovery /> },
  { path: '/events', element: <EventDiscovery /> },
  { path: '/profile', element: <Profile /> },
  { path: '/matchmaker', element: <AIMatchmaker /> },
  { path: '*', element: <NotFound /> }
]
```

## Error Handling

### Environment Configuration Errors

**Scenario**: Missing or empty Supabase credentials after fallback

**Handling**:
- Throw error immediately during module initialization
- Error messages: "Supabase URL is required" or "Supabase Anon Key is required"
- Application fails to start (prevents running with invalid configuration)

**Developer Experience**:
- Clear error message indicates which credential is missing
- .env.example file provides template for configuration
- Placeholder values allow development without immediate Supabase setup

### Dependency Installation Errors

**Scenario**: npm install fails with non-zero exit code

**Handling**:
- Display npm error message to developer
- Common causes: network issues, version conflicts, corrupted package-lock.json
- Resolution: Check npm error output, verify package.json syntax, clear node_modules and retry

### Routing Errors

**Scenario**: User navigates to undefined route

**Handling**:
- Catch-all route (`path="*"`) renders NotFound component
- Display "404 - Page Not Found" message
- Provide link to return to home page

**Scenario**: Component fails to render

**Handling**:
- React error boundaries (future enhancement)
- Display error message to user
- Log error details to console for debugging

### Navigation Errors

**Scenario**: Router fails to navigate to defined route

**Handling**:
- Display error message to user
- Log navigation error to console
- Provide fallback navigation option

## Testing Strategy

### Testing Approach

This feature involves **frontend infrastructure setup** with:
- Configuration management (environment variables, Supabase client)
- UI component rendering (React components with Tailwind CSS)
- Client-side routing (react-router-dom)
- Dependency installation (npm packages)

**Property-based testing is NOT appropriate** for this feature because:
1. **Configuration validation** - Testing environment variable handling is best done with example-based tests (missing value, empty string, valid value)
2. **UI rendering** - Component rendering should use snapshot tests and example-based tests
3. **Routing behavior** - Route matching is deterministic and best tested with specific path examples
4. **Dependency installation** - Integration test with actual npm install command

Therefore, the **Correctness Properties section is omitted** from this design document.

### Unit Testing Strategy

**Supabase Client Configuration** (`supabaseClient.js`):
- Test with valid environment variables → client initializes successfully
- Test with missing REACT_APP_SUPABASE_URL → throws "Supabase URL is required"
- Test with missing REACT_APP_SUPABASE_ANON_KEY → throws "Supabase Anon Key is required"
- Test with empty string values → throws appropriate error
- Test fallback to placeholder values when env vars not set

**Navbar Component**:
- Renders three navigation links (Profile, Event Discovery, AI Matchmaker)
- Each link has correct href/to attribute
- Icons render correctly (User, Calendar, Sparkles)
- Tailwind CSS classes applied correctly

**Page Components** (Profile, EventDiscovery, AIMatchmaker):
- Component renders without errors
- Heading text matches expected value
- Tailwind CSS classes applied for layout
- Snapshot test to catch unintended changes

**App Component**:
- BrowserRouter wraps application
- Navbar renders above Routes
- All route paths defined correctly
- Default route renders EventDiscovery

**Routing Behavior**:
- Navigate to "/" → EventDiscovery renders
- Navigate to "/events" → EventDiscovery renders
- Navigate to "/profile" → Profile renders
- Navigate to "/matchmaker" → AIMatchmaker renders
- Navigate to "/invalid-path" → NotFound renders
- Navigation updates URL without page reload

### Integration Testing

**Dependency Installation**:
- Run `npm install` → exits with status code 0
- Verify node_modules contains @supabase/supabase-js, lucide-react, react-router-dom
- Verify package.json contains correct version constraints

**Environment Configuration**:
- Create .env file with valid credentials → application starts successfully
- Missing .env file → application uses placeholder values
- Invalid .env values → application throws error with clear message

**End-to-End Navigation Flow**:
- Start application → EventDiscovery page displays
- Click Profile link → Profile page displays, URL updates to /profile
- Click AI Matchmaker link → AIMatchmaker page displays, URL updates to /matchmaker
- Click Event Discovery link → EventDiscovery page displays, URL updates to /events
- Navbar remains visible throughout navigation

### Testing Tools

- **Jest**: Unit test runner (included with Create React App)
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM

### Test File Structure

```
src/
├── supabaseClient.test.js
├── App.test.js
├── components/
│   └── Navbar.test.js
└── pages/
    ├── Profile.test.js
    ├── EventDiscovery.test.js
    ├── AIMatchmaker.test.js
    └── NotFound.test.js
```

### Coverage Goals

- **Unit Tests**: 80%+ coverage for configuration and component logic
- **Integration Tests**: All critical user flows (navigation, routing)
- **Snapshot Tests**: All page components to catch unintended UI changes

