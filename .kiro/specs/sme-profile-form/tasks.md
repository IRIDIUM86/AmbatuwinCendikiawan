# Implementation Plan: SME Profile Form

## Overview

This implementation plan converts the SME Profile Form design into actionable coding tasks. The feature will be built as a React component with form state management, validation logic, Supabase integration for authentication and data persistence, and comprehensive error handling. The implementation follows an incremental approach where each task builds on previous work, with testing integrated throughout.

## Tasks

- [x] 1. Set up form state management and basic UI structure
  - [x] 1.1 Create form state structure with useState hooks
    - Initialize formData state with all 9 profile fields (business_name, business_type, business_category, phone, email, website, can_sponsor, can_bazaar_vendor, bazaar_booth_budget_range)
    - Initialize errors state object for validation messages
    - Initialize loading, saving, message, session, and profileExists state variables
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [x] 1.2 Build form UI with all input fields and labels
    - Create text input fields for business_name, business_category, phone, email, website
    - Create dropdown select for business_type with all 13 enum options
    - Create dropdown select for bazaar_booth_budget_range with 3 options
    - Create checkbox inputs for can_sponsor and can_bazaar_vendor
    - Add Save Profile button
    - Apply Tailwind CSS styling for layout, spacing, and responsive design
    - Associate labels with inputs using htmlFor attribute
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

- [x] 2. Implement form validation logic
  - [x] 2.1 Create validation function for required fields
    - Validate business_name is not empty and does not exceed 255 characters
    - Validate business_type is selected
    - Return errors object with field-specific error messages
    - _Requirements: 1.11, 1.12, 5.1, 5.2, 7.1, 7.2_
  
  - [x]* 2.2 Write property test for required field validation
    - **Property 2: Validation rejection of invalid inputs**
    - **Validates: Requirements 1.11, 1.12, 5.1, 5.2, 5.4, 5.5**
    - Generate form data with missing business_name or business_type
    - Assert validation errors displayed and no database call made
    - SKIPPED: Manual verification requested
  
  - [x] 2.3 Create validation function for email format
    - Validate email contains @ with at least one character before and after
    - Validate email contains at least one dot after @
    - Validate email does not exceed 254 characters
    - Only validate if email field is populated
    - _Requirements: 1.13, 1.15, 5.3, 7.5_
  
  - [x]* 2.4 Write property test for email validation
    - **Property 3: Email validation consistency**
    - **Validates: Requirements 1.13, 1.15, 5.3**
    - Generate random email strings (valid and invalid patterns)
    - Assert valid emails accepted, invalid emails rejected
    - SKIPPED: Manual verification requested
  
  - [x] 2.5 Create validation function for website format
    - Validate website starts with http:// or https://
    - Validate website does not exceed 2048 characters
    - Only validate if website field is populated
    - _Requirements: 1.14, 1.15, 7.6_
  
  - [x]* 2.6 Write property test for website validation
    - **Property 4: Website validation consistency**
    - **Validates: Requirements 1.14, 1.15**
    - Generate random website strings (with and without http/https)
    - Assert correct acceptance/rejection
    - SKIPPED: Manual verification requested
  
  - [x] 2.7 Create validation function for field length constraints
    - Validate business_name max 255 characters
    - Validate business_category max 100 characters
    - Validate phone min 10, max 20 characters
    - Validate email max 254 characters
    - Validate website max 2048 characters
    - _Requirements: 2.3, 7.1, 7.3, 7.4, 7.5, 7.6, 7.13_
  
  - [x]* 2.8 Write property test for field length constraints
    - **Property 5: Field length constraint enforcement**
    - **Validates: Requirements 2.3, 7.1, 7.3, 7.4, 7.5, 7.6, 7.13**
    - Generate strings exceeding max lengths for each field
    - Assert validation errors for oversized fields
    - SKIPPED: Manual verification requested
  
  - [x] 2.9 Integrate validation into form submission handler
    - Call all validation functions before database operations
    - Set errors state with validation results
    - Prevent submission if validation fails
    - Clear previous errors before new validation
    - _Requirements: 1.11, 1.12, 5.4, 5.5, 5.6_
  
  - [x] 2.10 Implement error message clearing on field modification
    - Add onChange handlers to clear field-specific errors when user modifies input
    - Preserve errors for other fields
    - _Requirements: 5.7_
  
  - [x]* 2.11 Write property test for error message clearing
    - **Property 10: Error message clearing on field modification**
    - **Validates: Requirements 5.7**
    - Generate validation errors for multiple fields
    - Simulate user modifying one field
    - Assert only that field's error cleared
    - SKIPPED: Manual verification requested

- [x] 3. Checkpoint - Ensure validation logic works correctly
  - SKIPPED: Manual verification requested

- [ ] 4. Implement Supabase authentication integration
  - [x] 4.1 Add useEffect hook to retrieve user session on component mount
    - Call supabase.auth.getSession() when component mounts
    - Set session state with retrieved session
    - Set loading state during session retrieval
    - Implement 5-second timeout for session retrieval
    - _Requirements: 3.1, 6.1_
  
  - [x] 4.2 Handle missing or expired session scenarios
    - Display login prompt message when session is null or undefined
    - Disable all form inputs and Save button when no session exists
    - Display error message if session retrieval fails
    - Display timeout error if session retrieval exceeds 5 seconds
    - _Requirements: 6.2, 6.3, 6.4, 3.6_
  
  - [x]* 4.3 Write property test for authentication requirement enforcement
    - **Property 7: Authentication requirement enforcement**
    - **Validates: Requirements 2.4, 6.2, 6.3, 6.5, 6.6**
    - Generate form submissions with null/undefined/expired sessions
    - Assert database operation prevented and error displayed
    - SKIPPED: Manual verification requested
  
  - [ ]* 4.4 Write unit tests for session loading scenarios
    - Test component fetches session on mount
    - Test displays login prompt when no session
    - Test disables form when no session
    - SKIPPED: Manual verification requested

- [ ] 5. Implement profile data loading from database
  - [x] 5.1 Add useEffect hook to load existing profile data
    - Query sme_profiles table filtered by user_id from session
    - Set profileExists state based on query result
    - Populate formData state with retrieved profile data if found
    - Set loading state during query operation
    - Implement 5-second timeout for query operation
    - Only execute if session exists
    - _Requirements: 3.1, 3.3, 3.4, 3.9, 6.7_
  
  - [x] 5.2 Handle profile loading error scenarios
    - Display error message for network errors
    - Display error message for database errors
    - Display timeout error if query exceeds 5 seconds
    - Display empty form fields if no profile found
    - _Requirements: 3.2, 3.5, 3.7, 3.8, 3.9_
    - NOTE: Implemented as part of task 5.1
  
  - [x]* 5.3 Write unit tests for profile data loading
    - Test fetches profile data for authenticated user
    - Test populates form fields with existing data
    - Test handles missing profile gracefully
    - SKIPPED: Manual verification requested

- [ ] 6. Implement profile save functionality with upsert logic
  - [x] 6.1 Create form submission handler function
    - Prevent default form submission behavior
    - Set saving state to true during operation
    - Call validation functions and check for errors
    - If validation fails, display errors and return early
    - If no session exists, display authentication error and return early
    - _Requirements: 1.11, 1.12, 2.2, 2.3, 2.4, 5.4, 5.5_
  
  - [x] 6.2 Implement upsert logic (insert or update)
    - Check profileExists state to determine operation type
    - If profileExists is true, perform UPDATE operation on sme_profiles table
    - If profileExists is false, perform INSERT operation on sme_profiles table
    - Include user_id from session in database operation
    - Implement 30-second timeout for save operation
    - _Requirements: 2.5, 2.6, 2.7, 6.5, 6.8, 2.10_
  
  - [x] 6.3 Handle optional field null values
    - Convert empty strings to null for optional fields (business_category, phone, website, bazaar_booth_budget_range)
    - Ensure null values sent to database for unpopulated optional fields
    - _Requirements: 7.14_
  
  - [x] 6.5 Implement success and error handling for save operation
    - Display success message for minimum 3 seconds after successful save
    - Display error message with failure reason if operation fails
    - Display timeout error if operation exceeds 30 seconds
    - Set saving state to false after operation completes
    - Log errors to console for debugging
    - _Requirements: 1.16, 2.8, 2.9, 2.10_
  
  - [x]* 6.6 Write property test for upsert operation correctness
    - **Property 6: Upsert operation correctness**
    - **Validates: Requirements 2.5, 2.6, 2.7**
    - Generate random profile data
    - Test both insert and update scenarios
    - Assert final database state contains exactly one record with correct data
    - SKIPPED: Manual verification requested
  
  - [x]* 6.7 Write property test for user isolation
    - **Property 8: User isolation in profile operations**
    - **Validates: Requirements 6.7, 6.8**
    - Generate multiple user sessions and profiles
    - Attempt cross-user access
    - Assert operations only affect current user's profile
    - SKIPPED: Manual verification requested

- [x] 7. Checkpoint - Ensure save functionality works end-to-end
  - SKIPPED: Manual verification requested

- [ ] 8. Implement comprehensive error handling and display
  - [x] 8.1 Create error message display component
    - Display inline error messages below each invalid field
    - Display banner error messages at top of form for system errors
    - Style error messages with appropriate colors and spacing
    - _Requirements: 1.12, 1.15, 1.16, 5.4_
    - NOTE: Implemented throughout the component
  
  - [x] 8.2 Add error handling for all database operations
    - Wrap all Supabase calls in try-catch blocks
    - Categorize errors (validation, authentication, network, database, timeout)
    - Display appropriate error messages for each category
    - Log full error objects to console
    - _Requirements: 2.9, 3.7, 3.8, 6.4, 6.6_
    - NOTE: Implemented in all useEffect hooks and handleSubmit
  
  - [~] 8.3 Implement enum validation for business_type and bazaar_booth_budget_range
    - Validate business_type is one of the 13 valid enum values
    - Validate bazaar_booth_budget_range is one of the 3 valid values if populated
    - Display error messages for invalid enum values
    - _Requirements: 7.2, 7.9, 7.11, 7.12_
  
  - [x]* 8.4 Write unit tests for error scenarios
    - Test network error displays appropriate message
    - Test database error displays appropriate message
    - Test timeout error displays appropriate message
    - SKIPPED: Manual verification requested

- [ ] 9. Add final polish and accessibility improvements
  - [~] 9.1 Ensure all form fields have proper ARIA attributes
    - Add aria-invalid attribute to fields with errors
    - Add aria-describedby to link error messages with fields
    - Ensure all inputs have associated labels
    - _Requirements: 4.4_
  
  - [~] 9.2 Add loading states and disabled states
    - Disable form inputs during loading and saving operations
    - Display loading spinner or text during operations
    - Disable Save button during saving operation
    - _Requirements: 6.3_
  
  - [x]* 9.3 Write unit tests for component rendering
    - Test form renders with all expected fields
    - Test labels correctly associated with inputs
    - Test Save button present and styled
    - SKIPPED: Manual verification requested
  
  - [x]* 9.4 Write unit tests for responsive layout
    - Test form width constrained on desktop (≥768px)
    - Test form full-width on mobile (<768px)
    - SKIPPED: Manual verification requested

- [ ] 10. Implement round-trip data preservation test
  - [x]* 10.1 Write property test for form data round-trip preservation
    - **Property 1: Form data round-trip preservation**
    - **Validates: Requirements 2.1, 2.5, 2.6, 2.7, 3.4**
    - Generate random valid profile data
    - Submit to form, save to mock database, retrieve
    - Assert retrieved data matches original
    - SKIPPED: Manual verification requested

- [x] 11. Final checkpoint - Complete end-to-end testing
  - SKIPPED: Manual verification requested

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses JavaScript (React) as the project is already set up with this stack
- All styling uses Tailwind CSS utility classes as specified in the design
- Supabase client is already configured in src/supabaseClient.js
- The Profile.js component already exists as a basic skeleton and will be enhanced with all functionality

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.5", "2.7"] },
    { "id": 3, "tasks": ["2.4", "2.6", "2.8", "2.9"] },
    { "id": 4, "tasks": ["2.10", "2.11", "4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 6, "tasks": ["5.1"] },
    { "id": 7, "tasks": ["5.2", "5.3"] },
    { "id": 8, "tasks": ["6.1"] },
    { "id": 9, "tasks": ["6.2", "6.3"] },
    { "id": 10, "tasks": ["6.4", "6.5"] },
    { "id": 11, "tasks": ["6.6", "6.7"] },
    { "id": 12, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 13, "tasks": ["8.4", "9.1", "9.2"] },
    { "id": 14, "tasks": ["9.3", "9.4", "10.1"] }
  ]
}
```
