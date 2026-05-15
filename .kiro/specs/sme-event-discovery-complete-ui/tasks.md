# Implementation Plan: SME Event Discovery Complete UI

## Overview

This implementation plan breaks down the SME Event Discovery Complete UI feature into discrete, incremental coding tasks. The feature is a React-based single-page application with a unified dashboard featuring a split-screen layout where the AI Matchmaker chatbot (left pane, 30-40%) and Event Discovery grid (right pane, 60-70%) are displayed side-by-side. The application also includes a dedicated Profile page for managing user information. Implementation follows a component-based architecture with Supabase integration for event data and user profiles, and external AI API integration for chatbot functionality.

The implementation is organized into logical phases: core infrastructure and components, event discovery functionality, AI chatbot functionality, profile management, integration and wiring, and comprehensive testing with property-based tests for core business logic.

## Tasks

- [x] 1. Set up project structure, core utilities, and environment configuration
  - Create directory structure for components and utilities
  - Set up Supabase client configuration and environment variables
  - Create utility functions for API calls and data validation
  - Configure environment variables for AI API endpoint
  - _Requirements: 14.1_

- [x] 2. Implement Navigation Bar component
  - [x] 2.1 Create Navbar component with logo and navigation links
    - Implement sticky positioning at top of viewport
    - Display platform logo/name on left side
    - Add navigation links (Dashboard, My Applications, Opportunities) in center
    - Add User_Profile_Avatar on right side
    - Apply premium light mode styling (light background, dark text, shadow-md)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7_

  - [x] 2.2 Write unit tests for Navbar component
    - Test navbar renders with all navigation links
    - Test navigation links have correct href attributes
    - Test user avatar is displayed
    - Test sticky positioning class is applied
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Implement core layout components and split-screen structure
  - [x] 3.1 Create Dashboard page component with split-screen layout
    - Implement CSS Grid layout with 30-40% left column and 60-70% right column
    - Position layout below Navigation Bar
    - Fill remaining vertical space (min-h-screen minus navbar height)
    - Apply premium light mode background (bg-gray-50)
    - Left pane contains AI_Matchmaker_Pane
    - Right pane contains Event_Discovery_Pane
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 1.1_

  - [x] 3.2 Write unit tests for split-screen layout
    - Test grid layout with correct proportions (30-40% left, 60-70% right)
    - Test both panes are rendered
    - Test panes occupy correct width proportions
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Implement Event Discovery Pane infrastructure
  - [x] 4.1 Create EventDiscoveryPane component with state management
    - Initialize state for events, filteredEvents, selectedEvent, showModal, loading, error, filters
    - Implement useEffect to fetch events from Supabase on mount
    - Implement filter change handler
    - Implement event card click handler to show modal
    - Implement modal close handler
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [-] 4.2 Write property test for event filtering by type
    - **Property 1: Event Filtering by Type**
    - **Validates: Requirements 7.1**
    - Generate random event datasets with various types
    - Verify filtered results contain only matching event types
    - Verify no non-matching events are included

  - [-] 4.3 Write property test for event filtering by location
    - **Property 2: Event Filtering by Location**
    - **Validates: Requirements 7.1**
    - Generate random event datasets with various locations
    - Verify filtered results contain only matching locations
    - Verify AND logic when multiple filters applied

- [ ] 5. Implement Event Card component
  - [-] 5.1 Create EventCard component with event data display
    - Display event cover image (with fallback placeholder)
    - Display event name as heading (text-gray-900)
    - Display event date (formatted)
    - Display event location (city, state)
    - Display event type badge
    - Display featured indicator if is_featured is true
    - Display status badge (color-coded by status)
    - Apply premium light mode styling (light background, shadow-md, rounded-xl)
    - Implement click handler to trigger onSelect callback
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 19.1, 20.1, 21.1, 22.1, 23.1_

  - [ ] 5.2 Write property test for event card information completeness
    - **Property 6: Event Card Information Completeness**
    - **Validates: Requirements 4.1, 22.1, 23.1**
    - Generate random event objects with all required fields
    - Verify all fields are rendered in event card
    - Verify event name, date, location, and type are displayed

  - [ ] 5.3 Write property test for featured event indicator display
    - **Property 3: Featured Event Indicator Display**
    - **Validates: Requirements 19.1**
    - Generate events with is_featured true and false
    - Verify featured indicator appears only for is_featured=true
    - Verify no indicator for is_featured=false

  - [ ] 5.4 Write property test for event status display
    - **Property 4: Event Status Display**
    - **Validates: Requirements 20.1**
    - Generate events with various status values (upcoming, ongoing, completed)
    - Verify status badge displays correct status
    - Verify status badge uses appropriate color coding

  - [ ] 5.5 Write property test for event image display with fallback
    - **Property 5: Event Image Display with Fallback**
    - **Validates: Requirements 21.1**
    - Generate events with valid and invalid cover_image_url
    - Verify valid images are displayed
    - Verify placeholder displays for missing/invalid URLs

  - [x] 5.6 Write unit tests for EventCard component
    - Test event card renders with all required fields
    - Test click handler is called when card clicked
    - Test featured badge appears for featured events
    - Test status badge displays correct status
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 6. Implement Event Filter component
  - [-] 6.1 Create EventFilter component with filter controls
    - Implement sticky positioning at bottom of pane
    - Create dropdown for event type filter
    - Create dropdown for location filter
    - Implement filter change handlers
    - Implement clear filters button
    - Apply premium light mode styling (light background, border-t, shadow-md)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

  - [x] 6.2 Write unit tests for EventFilter component
    - Test filter dropdowns render with available options
    - Test filter change handlers are called correctly
    - Test clear filters button resets all filters
    - Test sticky positioning class is applied
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

- [ ] 7. Implement Event Details Modal component
  - [x] 7.1 Create EventDetailsModal component with full event information
    - Display event cover image
    - Display event name, description, date/time, location, venue
    - Display event type, target industries, target audience, expected footfall
    - Implement Apply as Vendor button with submission handler
    - Implement close button (X icon)
    - Apply premium light mode styling (light background, shadow-md, rounded-xl)
    - Display error message if application fails
    - Keep modal open to show error details
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 16.1, 24.1, 25.1, 26.1, 27.1_

  - [ ] 7.2 Write property test for event details modal field display
    - **Property 8: Event Details Modal Field Display**
    - **Validates: Requirements 24.1, 25.1, 26.1, 27.1**
    - Generate random event objects with complete information
    - Verify all fields are displayed in modal
    - Verify modal can be opened and closed

  - [ ] 7.3 Write property test for expected footfall display
    - **Property 9: Expected Footfall Display**
    - **Validates: Requirements 26.1**
    - Generate events with various expected_footfall values (>0, =0, missing)
    - Verify footfall > 0 displays the number
    - Verify footfall = 0 or missing displays 'TBD'

  - [ ] 7.4 Write unit tests for EventDetailsModal component
    - Test modal displays all event fields
    - Test Apply button triggers submission handler
    - Test close button closes modal
    - Test error message displays on submission failure
    - Test expected footfall displays 'TBD' when zero
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 8. Implement Supabase event fetching and error handling
  - [x] 8.1 Implement Supabase query for fetching all events
    - Create function to fetch all events from bazaar_events_Table
    - Retrieve all required fields: event_name, event_type, description, city, state, venue_name, event_date, start_time, end_time, target_industries, target_audience, expected_footfall, cover_image_url, status, is_featured
    - Implement error handling for failed queries
    - Implement retry mechanism
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ] 8.2 Write property test for event data validation
    - **Property 10: Event Data Validation**
    - **Validates: Requirements 30.1**
    - Generate events with missing required fields
    - Verify events with missing fields are skipped or error displayed
    - Verify valid events are processed correctly

  - [ ] 8.3 Write unit tests for Supabase integration
    - Mock Supabase client
    - Test events are fetched on component mount
    - Test failed fetch displays error message
    - Test retry button re-triggers fetch
    - Test all required fields are retrieved
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [ ] 9. Implement Loading and Error state components
  - [ ] 9.1 Create LoadingIndicator component
    - Implement spinner animation or skeleton loader
    - Display loading message ("Loading...", "Processing...", etc.)
    - Apply premium light mode styling
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 9.2 Create ErrorMessage component
    - Display error icon
    - Display error message text
    - Implement retry button with callback
    - Apply premium light mode styling (red/orange accent for errors)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9_

  - [x] 9.3 Write unit tests for LoadingIndicator and ErrorMessage
    - Test loading indicator renders with message
    - Test error message renders with retry button
    - Test retry button callback is called
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3_

- [ ] 10. Implement AI Chatbot Pane infrastructure
  - [ ] 10.1 Create ChatbotPane component with state management
    - Initialize state for messages, loading, error
    - Implement message send handler
    - Implement AI API call with error handling
    - Implement message storage in component state
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 18.1_

  - [ ] 10.2 Write property test for chat message storage and retrieval
    - **Property 7: Chat Message Storage and Retrieval**
    - **Validates: Requirements 18.1**
    - Generate random sequences of user and AI messages
    - Verify all messages are stored in state
    - Verify messages are retrievable in chronological order
    - Verify user and AI messages are distinguished

- [ ] 11. Implement Chat History component
  - [ ] 11.1 Create ChatHistory component with message display
    - Implement scrollable container for messages
    - Render ChatMessage components for each message
    - Display LoadingIndicator if loading is true
    - Implement auto-scroll to latest message
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ] 11.2 Write unit tests for ChatHistory component
    - Test messages are rendered in correct order
    - Test loading indicator appears during API call
    - Test auto-scroll to latest message works
    - Test chat history scrolls correctly
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [ ] 12. Implement Chat Message component
  - [ ] 12.1 Create ChatMessage component with message styling
    - Display user messages in blue bubble (bg-blue-600) aligned right
    - Display AI messages in gray bubble (bg-gray-200) aligned left
    - Use white text for user messages (text-white)
    - Use dark gray text for AI messages (text-gray-900)
    - Apply rounded corners (rounded-xl) and shadow (shadow-md)
    - Include timestamp or order indicator
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ] 12.2 Write unit tests for ChatMessage component
    - Test user message renders with blue background and right alignment
    - Test AI message renders with gray background and left alignment
    - Test timestamp is displayed
    - Test text contrast meets WCAG AA standards
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [ ] 13. Implement Chat Input component
  - [ ] 13.1 Create ChatInput component with message input and send button
    - Implement text input field (multi-line capable)
    - Implement Send button
    - Display character count indicator (max 1000 characters)
    - Implement Enter key handler (send on Enter, not Shift+Enter)
    - Implement onSend callback
    - Apply premium light mode styling
    - Disable Send button when input is empty
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10_

  - [ ] 13.2 Write unit tests for ChatInput component
    - Test input field accepts text
    - Test character limit is enforced
    - Test Send button is disabled when input is empty
    - Test Enter key sends message
    - Test Shift+Enter creates new line
    - Test onSend callback is called with correct message
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10_

- [ ] 14. Implement AI API integration
  - [ ] 14.1 Implement AI API message sending and response handling
    - Create function to send message to AI_API endpoint
    - Include message in request body
    - Include authentication headers if required
    - Handle HTTP 200 response with valid content
    - Handle HTTP 4xx/5xx error responses
    - Handle network errors
    - Handle timeout errors
    - Handle malformed/empty responses
    - Display appropriate error messages for each scenario
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ] 14.2 Write unit tests for AI API integration
    - Mock AI API endpoint
    - Test message is sent with correct payload
    - Test successful response is displayed
    - Test HTTP error responses display error message
    - Test network error displays network error message
    - Test timeout displays timeout error message
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

- [ ] 15. Implement environment variable configuration
  - [ ] 15.1 Configure environment variables for AI API
    - Read REACT_APP_AI_API_URL from environment
    - Create .env.example file with placeholder value
    - Add .env to .gitignore
    - Display error message if REACT_APP_AI_API_URL is not set
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 15.2 Write unit tests for environment configuration
    - Test app reads REACT_APP_AI_API_URL correctly
    - Test error message displays when env var not set
    - Test .env.example file exists with correct format
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 16. Implement Vendor Application feature
  - [ ] 16.1 Implement vendor application submission
    - Create function to submit vendor application to backend
    - Send application request with event ID and user information
    - Handle successful submission response
    - Handle error responses with user-friendly messages
    - Display success message in modal
    - Display error message in modal and keep modal open
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [ ] 16.2 Write unit tests for vendor application
    - Mock backend endpoint
    - Test application is submitted when button clicked
    - Test success message displays on successful submission
    - Test error message displays on submission failure
    - Test modal remains open to show error details
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ] 17. Implement User Profile Avatar and navigation
  - [ ] 17.1 Implement User Profile Avatar in Navbar
    - Display user profile avatar/icon on right side of navbar
    - Make avatar clickable to navigate to profile page
    - Apply premium light mode styling
    - Display default avatar icon if user image not available
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

  - [ ] 17.2 Write unit tests for User Profile Avatar
    - Test avatar is displayed in navbar
    - Test avatar is clickable
    - Test avatar navigates to profile page
    - Test default avatar displays when user image not available
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 18. Implement responsive design
  - [ ] 18.1 Implement responsive layout for different screen sizes
    - Use Tailwind CSS responsive classes (sm:, md:, lg:, xl:)
    - Desktop (1024px+): Display both panes side-by-side
    - Tablet (768px-1023px): Stack panes vertically or adjust column widths
    - Mobile (<768px): Display one pane at a time with toggle
    - Ensure navbar remains visible and functional on all sizes
    - Ensure event cards adjust size based on available space
    - Ensure chat interface remains functional on all sizes
    - Ensure minimum font size 14px on all sizes
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [ ] 18.2 Write unit tests for responsive design
    - Test layout at desktop width (1024px+)
    - Test layout at tablet width (768px-1023px)
    - Test layout at mobile width (<768px)
    - Test navbar remains visible on all sizes
    - Test text remains readable on all sizes
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [ ] 19. Implement accessibility features
  - [ ] 19.1 Implement accessibility features throughout application
    - Add ARIA labels to all interactive elements (buttons, links, inputs)
    - Add alt text to all images
    - Implement keyboard navigation (Tab, Enter, Escape keys)
    - Ensure color contrast meets WCAG AA minimum 4.5:1
    - Add support for screen readers
    - Associate labels with form inputs
    - Indicate focus state for keyboard navigation
    - Support text resizing without breaking layout
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7, 28.8_

  - [ ] 19.2 Write unit tests for accessibility features
    - Test ARIA labels are present on interactive elements
    - Test alt text is present on images
    - Test keyboard navigation works (Tab, Enter, Escape)
    - Test color contrast meets WCAG AA standards
    - Test focus state is visible
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7, 28.8_

- [ ] 20. Implement performance optimization
  - [ ] 20.1 Implement performance optimizations
    - Implement lazy-loading for Event Cards as user scrolls
    - Implement caching for fetched events
    - Optimize images for web (appropriate file size and format)
    - Minimize bundle size by removing unused dependencies
    - Implement code splitting for different pages/sections
    - Implement virtual scrolling for large chat histories
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6_

  - [ ] 20.2 Write unit tests for performance optimization
    - Test lazy-loading loads cards as user scrolls
    - Test event caching reduces API calls
    - Test virtual scrolling for large chat histories
    - Test bundle size is minimized
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6_

- [ ] 21. Implement data validation
  - [ ] 21.1 Implement data validation for external sources
    - Validate all required fields are present in fetched events
    - Skip invalid events or display error message
    - Validate AI API response contains expected message text
    - Display error message for invalid AI API responses
    - Validate user input is not empty before sending to AI API
    - Sanitize user input to prevent XSS attacks
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6_

  - [ ] 21.2 Write unit tests for data validation
    - Test events with missing required fields are handled
    - Test invalid AI API responses display error
    - Test empty user input is rejected
    - Test user input is sanitized for XSS prevention
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6_

- [ ] 22. Implement Profile Page and Form
  - [ ] 22.1 Create Profile Page component
    - Create page component accessible at "/profile" route
    - Display Profile_Form component
    - Apply premium light mode theme
    - Implement responsive layout
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5_

  - [ ] 22.2 Create Profile Form component with state management
    - Initialize formData state with all 9 profile fields (business_name, business_type, business_category, phone, email, website, can_sponsor, can_bazaar_vendor, bazaar_booth_budget_range)
    - Initialize errors state object for validation messages
    - Initialize loading, saving, message, session, and profileExists state variables
    - Create text input fields for business_name, business_category, phone, email, website
    - Create dropdown select for business_type with all 13 enum options
    - Create dropdown select for bazaar_booth_budget_range with 3 options
    - Create checkbox inputs for can_sponsor and can_bazaar_vendor
    - Add Save Profile button
    - Apply Tailwind CSS styling for layout, spacing, and responsive design
    - Associate labels with inputs using htmlFor attribute
    - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5, 32.6, 32.7, 32.8, 32.9, 32.10, 32.11, 32.12, 32.13, 32.14_

  - [ ] 22.3 Write unit tests for Profile Page and Form
    - Test Profile Page renders with Profile Form
    - Test form renders with all expected fields
    - Test labels correctly associated with inputs
    - Test Save button present and styled
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 32.1, 32.2_

- [ ] 23. Implement Profile Form validation
  - [ ] 23.1 Create validation function for required fields
    - Validate business_name is not empty and does not exceed 255 characters
    - Validate business_type is selected
    - Return errors object with field-specific error messages
    - _Requirements: 32.2, 32.3_

  - [ ] 23.2 Create validation function for email format
    - Validate email contains @ with at least one character before and after
    - Validate email contains at least one dot after @
    - Validate email does not exceed 254 characters
    - Only validate if email field is populated
    - _Requirements: 32.3, 32.4_

  - [ ] 23.3 Create validation function for website format
    - Validate website starts with http:// or https://
    - Validate website does not exceed 2048 characters
    - Only validate if website field is populated
    - _Requirements: 32.4, 32.5_

  - [ ] 23.4 Create validation function for field length constraints
    - Validate business_name max 255 characters
    - Validate business_category max 100 characters
    - Validate phone min 10, max 20 characters
    - Validate email max 254 characters
    - Validate website max 2048 characters
    - _Requirements: 32.5_

  - [ ] 23.5 Integrate validation into form submission handler
    - Call all validation functions before database operations
    - Set errors state with validation results
    - Prevent submission if validation fails
    - Clear previous errors before new validation
    - _Requirements: 32.2, 32.6_

  - [ ] 23.6 Implement error message clearing on field modification
    - Add onChange handlers to clear field-specific errors when user modifies input
    - Preserve errors for other fields
    - _Requirements: 32.14_

  - [ ] 23.7 Write unit tests for Profile Form validation
    - Test required field validation
    - Test email format validation
    - Test website format validation
    - Test field length constraints
    - Test error messages display and clear correctly
    - _Requirements: 32.2, 32.3, 32.4, 32.5_

- [ ] 24. Implement Profile Authentication and Data Loading
  - [ ] 24.1 Add useEffect hook to retrieve user session on component mount
    - Call supabase.auth.getSession() when component mounts
    - Set session state with retrieved session
    - Set loading state during session retrieval
    - Implement 5-second timeout for session retrieval
    - _Requirements: 32.11, 33.1_

  - [ ] 24.2 Handle missing or expired session scenarios
    - Display login prompt message when session is null or undefined
    - Disable all form inputs and Save button when no session exists
    - Display error message if session retrieval fails
    - Display timeout error if session retrieval exceeds 5 seconds
    - _Requirements: 32.11, 32.12_

  - [ ] 24.3 Add useEffect hook to load existing profile data
    - Query sme_profiles table filtered by user_id from session
    - Set profileExists state based on query result
    - Populate formData state with retrieved profile data if found
    - Set loading state during query operation
    - Implement 5-second timeout for query operation
    - Only execute if session exists
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7_

  - [ ] 24.4 Write unit tests for Profile authentication and data loading
    - Test component fetches session on mount
    - Test displays login prompt when no session
    - Test disables form when no session
    - Test fetches profile data for authenticated user
    - Test populates form fields with existing data
    - Test handles missing profile gracefully
    - _Requirements: 32.11, 32.12, 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7_

- [ ] 25. Implement Profile Save Functionality
  - [ ] 25.1 Create form submission handler function
    - Prevent default form submission behavior
    - Set saving state to true during operation
    - Call validation functions and check for errors
    - If validation fails, display errors and return early
    - If no session exists, display authentication error and return early
    - _Requirements: 32.6, 32.7_

  - [ ] 25.2 Implement upsert logic (insert or update)
    - Check profileExists state to determine operation type
    - If profileExists is true, perform UPDATE operation on sme_profiles table
    - If profileExists is false, perform INSERT operation on sme_profiles table
    - Include user_id from session in database operation
    - Implement 30-second timeout for save operation
    - _Requirements: 32.7, 32.8_

  - [ ] 25.3 Handle optional field null values
    - Convert empty strings to null for optional fields (business_category, phone, website, bazaar_booth_budget_range)
    - Ensure null values sent to database for unpopulated optional fields
    - _Requirements: 32.9_

  - [ ] 25.4 Implement success and error handling for save operation
    - Display success message for minimum 3 seconds after successful save
    - Display error message with failure reason if operation fails
    - Display timeout error if operation exceeds 30 seconds
    - Set saving state to false after operation completes
    - Log errors to console for debugging
    - _Requirements: 32.9, 32.10_

  - [ ] 25.5 Implement loading states and disabled states
    - Disable form inputs during loading and saving operations
    - Display loading spinner or text during operations
    - Disable Save button during saving operation
    - _Requirements: 32.13_

  - [ ] 25.6 Write unit tests for Profile save functionality
    - Mock Supabase client
    - Test form submission with valid data
    - Test upsert logic (insert and update scenarios)
    - Test success message displays on successful save
    - Test error message displays on save failure
    - Test loading states during operations
    - _Requirements: 32.6, 32.7, 32.8, 32.9, 32.10, 32.13_

- [ ] 26. Implement premium light mode theme
  - [ ] 26.1 Apply premium light mode theme throughout application
    - Use light gray background (bg-gray-50) for main viewport
    - Use dark gray text (text-gray-900) for all headings
    - Use medium gray text (text-gray-600) for body text and descriptions
    - Apply soft drop shadows (shadow-md) to all cards and modals
    - Apply rounded corners (rounded-xl) to all cards, buttons, inputs
    - Use vibrant blue (bg-blue-600) as primary accent color
    - Apply hover states (color change or shadow enhancement)
    - Maintain consistent spacing and padding using Tailwind utilities
    - Ensure text contrast meets WCAG AA minimum 4.5:1
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ] 26.2 Write unit tests for premium light mode theme
    - Test main viewport has bg-gray-50 background
    - Test headings have text-gray-900 color
    - Test body text has text-gray-600 color
    - Test cards have shadow-md and rounded-xl
    - Test buttons have bg-blue-600 color
    - Test hover states are applied
    - Test color contrast meets WCAG AA standards
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 27. Checkpoint - Ensure all unit and property tests pass
  - Ensure all unit tests pass
  - Ensure all property-based tests pass with minimum 100 iterations
  - Ensure test coverage meets 80%+ for component logic
  - Ensure all tests are properly documented
  - Ask the user if questions arise

- [ ] 28. Implement integration tests
  - [ ] 28.1 Write integration tests for event discovery flow
    - Test events are fetched and displayed on component mount
    - Test filtering events by type works end-to-end
    - Test filtering events by location works end-to-end
    - Test clicking event card opens modal
    - Test modal displays all event details
    - Test closing modal hides modal
    - _Requirements: 4.1, 5.1, 6.1, 6.2, 7.1, 7.2_

  - [ ] 28.2 Write integration tests for chat flow
    - Test sending message adds message to history
    - Test AI API is called with correct payload
    - Test AI response is displayed in chat history
    - Test loading indicator appears during API call
    - Test error message displays on API failure
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ] 28.3 Write integration tests for vendor application flow
    - Test clicking Apply button submits application
    - Test success message displays on successful submission
    - Test error message displays on submission failure
    - Test modal remains open to show error details
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

  - [ ] 28.4 Write integration tests for profile flow
    - Test profile page loads with existing data
    - Test form submission saves profile data
    - Test upsert logic works correctly
    - Test validation errors prevent submission
    - Test success message displays after save
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 32.1, 32.2, 32.6, 32.7, 32.8, 32.9, 32.10, 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7_

- [ ] 29. Checkpoint - Ensure all integration tests pass
  - Ensure all integration tests pass
  - Ensure all critical user flows are tested
  - Ensure error scenarios are covered
  - Ask the user if questions arise

- [ ] 30. Wire components together in Dashboard page
  - [ ] 30.1 Integrate all components into Dashboard page
    - Import and render Navbar component
    - Import and render AI_Matchmaker_Pane component (left, 30-40%)
    - Import and render Event_Discovery_Pane component (right, 60-70%)
    - Connect event discovery state to event cards and filters
    - Connect chat state to chat history and input
    - Ensure split-screen layout displays both panes with correct proportions
    - Test all components render correctly together
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [ ] 31. Final checkpoint - Ensure all tests pass and application is functional
  - Ensure all unit tests pass
  - Ensure all property-based tests pass
  - Ensure all integration tests pass
  - Verify application renders without errors
  - Verify all components are properly styled with premium light mode theme
  - Verify responsive design works on different screen sizes
  - Verify accessibility features are implemented
  - Verify Profile page is accessible and functional
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP, but are strongly recommended for production quality
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end user flows
- Checkpoints ensure incremental validation and allow for course correction
- All components use premium light mode theme with Tailwind CSS
- All interactive elements include ARIA labels for accessibility
- All images include alt text for accessibility
- All API calls include error handling and user-friendly error messages
- All state management uses React hooks (useState, useEffect)
- All styling uses Tailwind CSS utility classes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "3.1"] },
    { "id": 1, "tasks": ["2.2", "3.2", "4.1"] },
    { "id": 2, "tasks": ["4.2", "4.3", "5.1", "6.1", "9.1", "9.2"] },
    { "id": 3, "tasks": ["5.2", "5.3", "5.4", "5.5", "5.6", "6.2", "7.1", "8.1", "9.3"] },
    { "id": 4, "tasks": ["7.2", "7.3", "7.4", "8.2", "8.3", "10.1", "10.2"] },
    { "id": 5, "tasks": ["11.1", "12.1", "13.1", "14.1", "15.1", "16.1", "17.1"] },
    { "id": 6, "tasks": ["11.2", "12.2", "13.2", "14.2", "15.2", "16.2", "17.2", "18.1"] },
    { "id": 7, "tasks": ["18.2", "19.1", "20.1", "21.1", "22.1"] },
    { "id": 8, "tasks": ["19.2", "20.2", "21.2", "22.2"] },
    { "id": 9, "tasks": ["22.3", "23.1", "23.2", "23.3", "23.4"] },
    { "id": 10, "tasks": ["23.5", "23.6", "23.7", "24.1"] },
    { "id": 11, "tasks": ["24.2", "24.3", "24.4"] },
    { "id": 12, "tasks": ["25.1", "25.2", "25.3"] },
    { "id": 13, "tasks": ["25.4", "25.5", "25.6"] },
    { "id": 14, "tasks": ["26.1", "26.2"] },
    { "id": 15, "tasks": ["28.1", "28.2", "28.3", "28.4"] },
    { "id": 16, "tasks": ["30.1"] }
  ]
}
```
