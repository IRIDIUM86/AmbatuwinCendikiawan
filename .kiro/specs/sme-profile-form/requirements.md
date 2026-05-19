# Requirements Document

## Introduction

The SME Profile Form feature enables SME vendors to create and manage their business profiles within the Event Discovery application. This feature provides a comprehensive form interface where vendors can input essential business information, contact details, and event participation preferences. The profile data is persisted to the Supabase sme_profiles table and supports both profile creation and updates.

## Glossary

- **Profile_Form**: The React component that renders the business profile input form
- **Supabase_Client**: The configured Supabase JavaScript client for database operations
- **SME_Profiles_Table**: The Supabase database table storing vendor profile information
- **Business_Type**: An enumerated field representing the category of business (food_beverage, retail, technology, etc.)
- **Budget_Range**: An enumerated field representing booth budget preferences (budget, mid-range, premium)
- **User_Session**: The authenticated user context from Supabase Auth
- **Profile_Data**: The complete set of business information collected from the form

## Requirements

### Requirement 1: Profile Form Input Fields

**User Story:** As an SME vendor, I want to input my business details through a comprehensive form, so that event organizers can discover and contact my business.

#### Acceptance Criteria

1. THE Profile_Form SHALL display a text input field for business_name that accepts between 1 and 200 characters
2. THE Profile_Form SHALL display a dropdown field for business_type with options: food_beverage, retail, technology, services, health_wellness, education, entertainment, fashion, home_garden, automotive, finance, real_estate, other
3. THE Profile_Form SHALL display a text input field for business_category that accepts between 0 and 100 characters
4. THE Profile_Form SHALL display a text input field for phone that accepts between 10 and 20 characters
5. THE Profile_Form SHALL display a text input field for email that accepts between 5 and 254 characters
6. THE Profile_Form SHALL display a text input field for website that accepts between 0 and 2048 characters
7. THE Profile_Form SHALL display a checkbox field for can_sponsor
8. THE Profile_Form SHALL display a checkbox field for can_bazaar_vendor
9. THE Profile_Form SHALL display a dropdown field for bazaar_booth_budget_range with options: budget, mid-range, premium
10. THE Profile_Form SHALL display a Save Profile button
11. WHEN the Save Profile button is clicked, THE Profile_Form SHALL validate that business_name and business_type are populated
12. IF business_name or business_type are not populated when Save Profile is clicked, THEN THE Profile_Form SHALL display an error message indicating which required fields are missing
13. WHEN the email field contains a value, THE Profile_Form SHALL validate that the email contains an @ symbol with at least one character before and after it
14. WHEN the website field contains a value, THE Profile_Form SHALL validate that the website begins with http:// or https://
15. IF email or website validation fails, THEN THE Profile_Form SHALL display an error message indicating the invalid format
16. IF form submission to the backend fails, THEN THE Profile_Form SHALL display an error message with the failure reason

### Requirement 2: Profile Data Persistence

**User Story:** As an SME vendor, I want my profile information saved to the database, so that I can access it later and event organizers can view my details.

#### Acceptance Criteria

1. WHEN the Save Profile button is clicked, THE Profile_Form SHALL collect all populated form field values into Profile_Data
2. IF any required field in Profile_Data is empty or null, THEN THE Profile_Form SHALL display an error message indicating which required fields are missing and SHALL NOT proceed with the database operation
3. IF any field in Profile_Data exceeds its maximum allowed length or violates its format constraints, THEN THE Profile_Form SHALL display an error message indicating which fields are invalid and SHALL NOT proceed with the database operation
4. IF the current User_Session is not authenticated or has expired, THEN THE Profile_Form SHALL display an error message indicating authentication is required and SHALL NOT proceed with the database operation
5. WHEN Profile_Data is collected and validated, THE Profile_Form SHALL invoke the Supabase_Client to check if a profile exists for the current User_Session
6. IF a profile exists for the current User_Session, THEN THE Profile_Form SHALL perform an UPDATE operation on the SME_Profiles_Table
7. IF no profile exists for the current User_Session, THEN THE Profile_Form SHALL perform an INSERT operation on the SME_Profiles_Table
8. WHEN the database operation completes successfully, THE Profile_Form SHALL display a success message indicating the profile was saved for a minimum of 3 seconds or until the user dismisses it
9. IF the database operation fails, THEN THE Profile_Form SHALL display an error message indicating the operation failed and the type of failure
10. IF the database operation does not complete within 30 seconds, THEN THE Profile_Form SHALL display an error message indicating the operation timed out and SHALL allow the user to retry

### Requirement 3: Profile Data Loading

**User Story:** As an SME vendor, I want my existing profile information loaded when I visit the Profile page, so that I can review and update my details without re-entering everything.

#### Acceptance Criteria

1. WHEN the Profile_Form component mounts, THE Profile_Form SHALL retrieve the current User_Session from Supabase_Client within 5 seconds
2. IF the User_Session is null or undefined, THEN THE Profile_Form SHALL display empty form fields for new profile creation
3. WHEN User_Session is retrieved and is not null, THE Profile_Form SHALL query the SME_Profiles_Table for a profile matching the user_id within 5 seconds
4. IF a profile record is found, THEN THE Profile_Form SHALL populate the business_name, business_type, business_category, phone, email, website, can_sponsor, can_bazaar_vendor, and bazaar_booth_budget_range form fields with the retrieved profile data
5. IF no profile record is found, THEN THE Profile_Form SHALL display empty form fields for new profile creation
6. IF the session retrieval operation does not complete within 5 seconds, THEN THE Profile_Form SHALL display an error message indicating the session retrieval timed out
7. IF the query operation fails due to a network error, THEN THE Profile_Form SHALL display an error message indicating a network error occurred
8. IF the query operation fails due to a database error, THEN THE Profile_Form SHALL display an error message indicating a database error occurred
9. IF the query operation does not complete within 5 seconds, THEN THE Profile_Form SHALL display an error message indicating the query timed out

### Requirement 4: Form Styling and Layout

**User Story:** As an SME vendor, I want a modern and clean form interface, so that I can easily navigate and complete my profile information.

#### Acceptance Criteria

1. THE Profile_Form SHALL use Tailwind CSS utility classes for all styling
2. THE Profile_Form SHALL display form fields in a logical vertical layout with a minimum of 16 pixels of spacing between each field
3. THE Profile_Form SHALL display field labels above each input element
4. THE Profile_Form SHALL associate each label with its corresponding input element using the htmlFor attribute
5. THE Profile_Form SHALL apply consistent styling to all text input fields including border, border-radius, padding, and font properties
6. THE Profile_Form SHALL apply consistent styling to all dropdown fields including border, border-radius, padding, and font properties
7. THE Profile_Form SHALL apply consistent styling to all checkbox fields including size and spacing
8. THE Profile_Form SHALL display the Save Profile button with solid background color styling to indicate it is the primary action
9. WHEN the viewport width is 768 pixels or greater, THE Profile_Form SHALL display form fields with a maximum width of 600 pixels
10. WHEN the viewport width is less than 768 pixels, THE Profile_Form SHALL display form fields with full width minus horizontal padding

### Requirement 5: Form Validation

**User Story:** As an SME vendor, I want validation feedback on my form inputs, so that I can correct errors before submitting my profile.

#### Acceptance Criteria

1. WHEN the Save Profile button is clicked, THE Profile_Form SHALL validate that business_name contains at least 1 character and does not exceed 255 characters
2. WHEN the Save Profile button is clicked, THE Profile_Form SHALL validate that business_type is selected
3. WHEN the Save Profile button is clicked, THE Profile_Form SHALL validate that email contains an @ symbol, has at least one character before the @ symbol, has at least one character after the @ symbol, contains at least one dot after the @ symbol, and does not exceed 254 characters
4. IF validation fails for one or more fields, THEN THE Profile_Form SHALL display an error message directly below each invalid field indicating the specific validation rule that was violated
5. IF validation fails, THEN THE Profile_Form SHALL prevent the database operation from executing and SHALL preserve all user-entered values in the form fields
6. WHEN all validations pass, THE Profile_Form SHALL proceed with the database operation
7. WHEN a user modifies the content of a field that previously failed validation, THE Profile_Form SHALL clear the error message for that field

### Requirement 6: User Authentication Integration

**User Story:** As an SME vendor, I want my profile associated with my authenticated account, so that only I can view and edit my business information.

#### Acceptance Criteria

1. WHEN the Profile_Form component mounts, THE Profile_Form SHALL retrieve the current User_Session from Supabase_Client
2. IF no User_Session exists, THEN THE Profile_Form SHALL display a message prompting the user to log in
3. IF no User_Session exists, THEN THE Profile_Form SHALL disable all form inputs and the Save Profile button
4. IF the session retrieval operation fails, THEN THE Profile_Form SHALL display an error message indicating the session could not be retrieved
5. WHEN saving profile data, THE Profile_Form SHALL include the user_id from User_Session in the database operation
6. IF the save operation fails due to missing or invalid user_id, THEN THE Profile_Form SHALL display an error message indicating authentication is required
7. WHEN querying the SME_Profiles_Table, THE Profile_Form SHALL filter by user_id matching the current User_Session user_id
8. WHEN updating the SME_Profiles_Table, THE Profile_Form SHALL only update records where user_id matches the current User_Session user_id

### Requirement 7: Database Schema Compliance

**User Story:** As a system administrator, I want the Profile Form to comply with the database schema, so that data integrity is maintained across the application.

#### Acceptance Criteria

1. THE Profile_Form SHALL send business_name as a VARCHAR with maximum length 255 characters to the SME_Profiles_Table
2. THE Profile_Form SHALL send business_type as one of the valid ENUM values (food_beverage, retail, technology, services, health_wellness, education, entertainment, fashion, home_garden, automotive, finance, real_estate, other) to the SME_Profiles_Table
3. THE Profile_Form SHALL send business_category as a VARCHAR with maximum length 100 characters to the SME_Profiles_Table
4. THE Profile_Form SHALL send phone as a VARCHAR with maximum length 20 characters to the SME_Profiles_Table
5. THE Profile_Form SHALL send email as a VARCHAR with maximum length 255 characters to the SME_Profiles_Table
6. THE Profile_Form SHALL send website as a VARCHAR with maximum length 2048 characters to the SME_Profiles_Table
7. THE Profile_Form SHALL send can_sponsor as a BOOLEAN to the SME_Profiles_Table
8. THE Profile_Form SHALL send can_bazaar_vendor as a BOOLEAN to the SME_Profiles_Table
9. THE Profile_Form SHALL send bazaar_booth_budget_range as a VARCHAR matching one of the valid values (budget, mid-range, premium) to the SME_Profiles_Table
10. THE Profile_Form SHALL send user_id as a UUID to the SME_Profiles_Table
11. IF business_type contains a value not in the valid ENUM list, THEN THE Profile_Form SHALL display an error message indicating the business_type is invalid
12. IF bazaar_booth_budget_range contains a value not in the valid list, THEN THE Profile_Form SHALL display an error message indicating the bazaar_booth_budget_range is invalid
13. IF any VARCHAR field exceeds its maximum length, THEN THE Profile_Form SHALL display an error message indicating which field exceeds the maximum length
14. THE Profile_Form SHALL send NULL for optional fields (business_category, phone, website, bazaar_booth_budget_range) when they are empty or not populated
