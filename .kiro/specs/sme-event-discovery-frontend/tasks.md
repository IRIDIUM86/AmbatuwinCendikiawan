# Implementation Plan: SME Event Discovery Frontend Foundation

## Overview

This implementation plan establishes the foundational frontend infrastructure for the SME Event Discovery application. The approach follows a bottom-up strategy: first setting up the project structure and dependencies, then implementing core configuration (Supabase client), followed by building UI components (pages and navigation), and finally wiring everything together with routing. Each task builds incrementally to ensure the application remains functional at every checkpoint.

## Tasks

- [x] 1. Set up project structure and install dependencies
  - Create directory structure: `src/components/`, `src/pages/`
  - Add @supabase/supabase-js (^2.0.0), lucide-react (^0.263.0), and react-router-dom (^6.0.0) to package.json dependencies
  - Run `npm install` and verify successful installation (exit code 0)
  - Verify node_modules contains @supabase/supabase-js, lucide-react, and react-router-dom subdirectories
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Configure environment variables and Supabase client
  - [x] 2.1 Create .env.example file with placeholder Supabase credentials
    - Add line: `REACT_APP_SUPABASE_URL=https://your-project.supabase.co`
    - Add line: `REACT_APP_SUPABASE_ANON_KEY=your-anon-key`
    - Add comment: `# Get these values from your Supabase project settings`
    - Ensure .env is listed in .gitignore
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 2.2 Implement Supabase client configuration in supabaseClient.js
    - Import createClient from @supabase/supabase-js
    - Read REACT_APP_SUPABASE_URL from environment with fallback to "https://your-project.supabase.co"
    - Read REACT_APP_SUPABASE_ANON_KEY from environment with fallback to "your-anon-key"
    - Validate that Supabase URL is non-empty after fallback (throw "Supabase URL is required" if empty)
    - Validate that Supabase Anon Key is non-empty after fallback (throw "Supabase Anon Key is required" if empty)
    - Initialize and export Supabase client using createClient()
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 2.3 Write unit tests for Supabase client configuration
    - Test with valid environment variables → client initializes successfully
    - Test with missing REACT_APP_SUPABASE_URL → throws "Supabase URL is required"
    - Test with missing REACT_APP_SUPABASE_ANON_KEY → throws "Supabase Anon Key is required"
    - Test with empty string values → throws appropriate error
    - Test fallback to placeholder values when env vars not set
    - _Requirements: 2.7, 2.8, 8.6, 8.7_

- [x] 3. Checkpoint - Verify Supabase client configuration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create page components
  - [x] 4.1 Implement Profile page component (Profile.js)
    - Create functional component that renders a container div with Tailwind CSS classes
    - Add heading element with text "Profile"
    - Apply Tailwind CSS classes for layout (container, padding, text sizing)
    - Export component as default
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.2 Implement Event Discovery page component (EventDiscovery.js)
    - Create functional component that renders a container div with Tailwind CSS classes
    - Add heading element with text "Event Discovery"
    - Apply Tailwind CSS classes for layout (container, padding, text sizing)
    - Export component as default
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 4.3 Implement AI Matchmaker page component (AIMatchmaker.js)
    - Create functional component that renders a container div with Tailwind CSS classes
    - Add heading element with text "AI Matchmaker"
    - Apply Tailwind CSS classes for layout (container, padding, text sizing)
    - Export component as default
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 4.4 Implement Not Found page component (NotFound.js)
    - Create functional component that renders a centered container
    - Add heading with text "404 - Page Not Found"
    - Add Link component from react-router-dom pointing to "/" with text "Return to Home"
    - Apply Tailwind CSS classes for layout and styling
    - Export component as default
    - _Requirements: 3.7_

  - [ ]* 4.5 Write unit tests for page components
    - Test Profile component renders without errors and displays "Profile" heading
    - Test EventDiscovery component renders without errors and displays "Event Discovery" heading
    - Test AIMatchmaker component renders without errors and displays "AI Matchmaker" heading
    - Test NotFound component renders with 404 message and home link
    - Add snapshot tests for all page components
    - _Requirements: 5.5, 6.7, 7.6_

- [x] 5. Create navigation bar component
  - [x] 5.1 Implement Navbar component (Navbar.js)
    - Import User, Calendar, Sparkles icons from lucide-react
    - Import Link component from react-router-dom
    - Create functional component that renders a nav element with Tailwind CSS classes
    - Add Link to "/profile" with User icon and "Profile" label
    - Add Link to "/events" with Calendar icon and "Event Discovery" label
    - Add Link to "/matchmaker" with Sparkles icon and "AI Matchmaker" label
    - Apply Tailwind CSS classes for layout (flexbox, spacing, background, shadow)
    - Export component as default
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7_

  - [ ]* 5.2 Write unit tests for Navbar component
    - Test that three navigation links render (Profile, Event Discovery, AI Matchmaker)
    - Test that each link has correct href/to attribute
    - Test that icons render correctly (User, Calendar, Sparkles)
    - Test that Tailwind CSS classes are applied
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 6. Checkpoint - Verify component rendering
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement routing and wire application together
  - [x] 7.1 Implement App.js with routing configuration
    - Import BrowserRouter, Routes, Route from react-router-dom
    - Import Navbar component
    - Import all page components (Profile, EventDiscovery, AIMatchmaker, NotFound)
    - Wrap application in BrowserRouter
    - Render Navbar component (persistent across routes)
    - Define Routes with route configurations:
      - Route path="/" element={<EventDiscovery />}
      - Route path="/events" element={<EventDiscovery />}
      - Route path="/profile" element={<Profile />}
      - Route path="/matchmaker" element={<AIMatchmaker />}
      - Route path="*" element={<NotFound />} (catch-all)
    - Apply Tailwind CSS classes for overall layout (min-height, background)
    - Export App component as default
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ]* 7.2 Write unit tests for App component
    - Test that BrowserRouter wraps application
    - Test that Navbar renders above Routes
    - Test that all route paths are defined correctly
    - Test that default route renders EventDiscovery
    - _Requirements: 9.2, 9.3, 9.7_

  - [ ]* 7.3 Write integration tests for routing behavior
    - Test navigate to "/" → EventDiscovery renders
    - Test navigate to "/events" → EventDiscovery renders
    - Test navigate to "/profile" → Profile renders
    - Test navigate to "/matchmaker" → AIMatchmaker renders
    - Test navigate to "/invalid-path" → NotFound renders
    - Test that navigation updates URL without page reload
    - Test that Navbar remains visible during navigation
    - _Requirements: 3.5, 3.6, 3.7, 4.5, 4.8, 5.4, 6.5, 6.6, 7.5, 7.7_

- [x] 8. Final checkpoint - Verify complete application
  - Run the development server and manually verify navigation works
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation follows a bottom-up approach: dependencies → configuration → components → routing
- All page components are placeholders with headings only (no data fetching or business logic)
- Supabase client is configured but not yet used by any components
- Environment variables use Create React App conventions (REACT_APP_ prefix)
- Tailwind CSS classes are applied throughout for consistent styling

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["2.3"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["4.5", "5.1"] },
    { "id": 5, "tasks": ["5.2"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] }
  ]
}
```
