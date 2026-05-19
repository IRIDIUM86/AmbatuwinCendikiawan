# Requirements Document

## Introduction

The Public Vendor Portal adds a new public-facing web experience and a new Supabase-direct CRUD service to the AmbatuwinCendikiawan platform without altering the existing AI matching backend (`api_server.py`, `database_service.py`, `llm_service.py`, `event_matcher.py`, `main.py`). The portal introduces:

1. A polished marketing/onboarding experience styled after Google Skills (skills.google.com): a Home Page that explains the platform and what to expect, and an Apply-as-Vendor page with an "AI-Generated Proposal" button.
2. A new Python service (FastAPI) that performs CRUD operations directly against Supabase using the keys defined in `.env`, covering authentication, SME profiles, bazaar events, sponsorship packages, bazaar booths, and SME event applications.
3. A documented set of decorative and content imagery required by the visual design.

The existing backend remains untouched and continues to serve the AI matching and chatbot endpoints. The new frontend (Vite + React + TypeScript) lives in a new `webapp/` directory; the new backend service lives in a new `supabase_api/` directory and runs on a different port than the existing Flask server.

## Glossary

- **Public_Portal**: The new public-facing single-page web application built with Vite + React + TypeScript, located in `webapp/`.
- **Home_Page**: The landing route (`/`) of Public_Portal that introduces the platform and what to expect.
- **Apply_As_Vendor_Page**: The route (`/apply`) of Public_Portal where an SME user submits an application to participate in a bazaar event.
- **AI_Proposal_Button**: A button on Apply_As_Vendor_Page that requests a draft proposal text from Supabase_API_Service and inserts it into the proposal field.
- **Shared_Layout**: The persistent visual chrome of Public_Portal containing the top header, left sidebar, main content region, and footer.
- **Top_Header**: The horizontal bar at the top of Shared_Layout containing the logo, centered search, "Sign in" link, and "Join" pill button.
- **Sidebar_Nav**: The vertical navigation rail on the left of Shared_Layout containing Home, Events, Apply, Profile, and Applications entries.
- **Card_Grid**: A responsive grid of event cards rendered in Google-Skills card style.
- **Event_Card**: A single card in Card_Grid presenting one bazaar event.
- **Hero_Section**: The first viewport section of Home_Page containing the headline, subheadline, search/CTA, and decorative illustrations.
- **Dark_Feature_Section**: A dark-themed section on Home_Page with pill-shaped category filter chips, modeled after the "Skill up on AI today" panel on skills.google.com.
- **Supabase_API_Service**: The new FastAPI Python service in `supabase_api/` that performs CRUD operations against Supabase via `supabase-py`.
- **Auth_Endpoints**: The subset of Supabase_API_Service routes that handle registration, login, and logout via Supabase Auth.
- **AI_Proposal_Endpoint**: The Supabase_API_Service route `POST /api/proposals/generate` that returns a draft proposal string.
- **Existing_Backend**: The set of files `api_server.py`, `database_service.py`, `llm_service.py`, `event_matcher.py`, `config.py`, and `main.py` at the workspace root, which MUST NOT be modified by this feature.
- **Env_Keys**: The environment variables `supabaseUrl`, `supabaseKey`, `supabaseSecret`, `supabaseAnonPublic`, `REACT_APP_SUPABASE_URL`, and `REACT_APP_SUPABASE_ANON_KEY` defined in `.env`.
- **Anon_Key**: The Supabase anonymous public key, sourced from `supabaseAnonPublic` (or `REACT_APP_SUPABASE_ANON_KEY` for the frontend).
- **Service_Key**: The Supabase service role key, sourced from `supabaseSecret`.
- **SME**: A Small or Medium Enterprise represented by a row in the `sme_profile` table.
- **Bazaar_Event**: A row in the `bazaar_events` table representing a hostable event.
- **Sponsorship_Package**: A row in the `sponsorship_package` table representing a tiered sponsorship for a Bazaar_Event.
- **Bazaar_Booth**: A row in the `bazaar_booths` table representing a physical booth slot for a Bazaar_Event.
- **SME_Application**: A row in the `sme_event_applications` table representing an SME's request to participate in a Bazaar_Event.
- **Application_Status**: A value of the `application_status_enum` (`pending`, `approved`, `rejected`, `withdrawn`).
- **Booking_Status**: A value of the `booking_status_enum` (`available`, `reserved`, `booked`, `cancelled`).
- **Tier_Level**: A value of the `tier_level_enum` (`bronze`, `silver`, `gold`, `platinum`).
- **Business_Type**: A value of the `business_type_enum` (`food_beverage`, `fashion`, `crafts`, `services`, `other`).
- **Google_Skills_Style**: The visual language defined in §UI Style Reference, derived from skills.google.com screenshots provided by the user.

## UI Style Reference (Google_Skills_Style)

Public_Portal SHALL adopt the following visual language for all new pages:

- White or off-white page background with bold sans-serif headings (Inter, Google Sans, or Space Grotesk fallback).
- Rounded pill-shaped search bar with a subtle drop shadow as the central CTA in Hero_Section.
- Vibrant decorative blob illustrations (blue circles with yellow triangles, red hearts, purple stars, green semicircles, pink stars on blue blobs) placed as ambient background elements around Hero_Section and section transitions.
- Left vertical Sidebar_Nav with monochrome line icons and small text labels (Home, Events, Apply, Profile, Applications).
- Card_Grid rendered as white cards with: a category label chip, a skill/tier badge chip, a bold title, a one-paragraph description, a duration row with a clock icon, and a circular blue arrow CTA in the bottom-right corner.
- One Dark_Feature_Section per page maximum, using a near-black background with pill-shaped category filter tabs.
- Primary CTA buttons are rounded blue pill buttons (Google blue, hex `#1a73e8`).
- Top_Header has logo on the left, centered search, and "Sign in" text link plus "Join" pill button on the right.
- Color palette: white and light gray surfaces, Google blue (`#1a73e8`) for primary actions, near-black (`#202124`) for body text, and a multi-color decorative palette (`#FBBC04` yellow, `#EA4335` red, `#34A853` green, `#A142F4` purple, `#FF6D9D` pink) for decorative shapes only.

## Requirements

### Requirement 1: Project Layout and Non-Modification of Existing Backend

**User Story:** As the project maintainer, I want the new portal and CRUD service to live in dedicated new directories, so that the existing AI matching backend remains untouched and the two systems can evolve independently.

#### Acceptance Criteria

1. THE Public_Portal SHALL reside in a new top-level directory named `webapp/`.
2. THE Supabase_API_Service SHALL reside in a new top-level directory named `supabase_api/`.
3. IF a build step or task in this feature would modify any file in Existing_Backend, THEN THE Public_Portal build process SHALL fail with an explicit error referencing the protected file.
4. THE Public_Portal SHALL be implemented using Vite, React 18, and TypeScript.
5. THE Supabase_API_Service SHALL be implemented using FastAPI and `supabase-py`.
6. THE Supabase_API_Service SHALL listen on a TCP port that is different from the port used by `api_server.py` (which defaults to 5000), with the default port for Supabase_API_Service being 8000.
7. WHERE the user starts both services on the same machine, THE Public_Portal SHALL be configured to call Supabase_API_Service for CRUD operations and Existing_Backend for AI matching and chatbot operations.

### Requirement 2: Environment Variable Handling

**User Story:** As a developer running the portal locally, I want all secrets to come from the existing `.env` file using the documented key names, so that I do not need to rename or duplicate credentials.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL read the Supabase project URL from the environment variable `supabaseUrl`.
2. THE Supabase_API_Service SHALL read the Supabase service role key from the environment variable `supabaseSecret`.
3. THE Supabase_API_Service SHALL read the Supabase anonymous public key from the environment variable `supabaseAnonPublic`.
4. WHERE the environment variable `supabaseKey` is set and `supabaseSecret` is not set, THE Supabase_API_Service SHALL fall back to using `supabaseKey` for service-role operations.
5. THE Public_Portal SHALL read the Supabase URL from the environment variable `REACT_APP_SUPABASE_URL` at build time.
6. THE Public_Portal SHALL read the Supabase anonymous key from the environment variable `REACT_APP_SUPABASE_ANON_KEY` at build time.
7. IF any required environment variable is missing at startup, THEN THE Supabase_API_Service SHALL exit with a non-zero status code and log the name of the missing variable.
8. THE Supabase_API_Service SHALL never include the value of `supabaseSecret` or `supabaseKey` in any HTTP response body.

### Requirement 3: Home_Page Content and Structure

**User Story:** As a first-time visitor, I want a Home_Page that clearly explains what the platform does and what to expect, so that I can decide whether to apply as a vendor or browse events.

#### Acceptance Criteria

1. WHEN a user navigates to the path `/`, THE Public_Portal SHALL render Home_Page within Shared_Layout.
2. THE Home_Page SHALL contain a Hero_Section as the first visible section, including a headline of at most 80 characters, a subheadline of at most 200 characters, a pill-shaped search input, and at least two decorative illustrations.
3. THE Home_Page SHALL contain an "About the Platform" section that describes in plain language what AmbatuwinCendikiawan does.
4. THE Home_Page SHALL contain a "How It Works" section that lists at least three sequential steps, each with an icon, a short title, and a one-sentence description.
5. THE Home_Page SHALL contain a "Who It's For" section that explicitly addresses two audiences: SMEs and Event Organizers.
6. THE Home_Page SHALL contain a "Featured Events" Card_Grid that displays up to six Event_Card items fetched from Supabase_API_Service.
7. THE Home_Page SHALL contain one Dark_Feature_Section with at least four pill-shaped category filter chips.
8. THE Home_Page SHALL contain a footer with links to Home, Events, Apply, Privacy, and Contact.
9. WHEN the Featured Events fetch returns fewer than six events, THE Home_Page SHALL render only the available events without empty placeholder cards.
10. IF the Featured Events fetch fails, THEN THE Home_Page SHALL display a non-blocking inline message stating that events could not be loaded, and THE Home_Page SHALL still render all other sections.

### Requirement 4: Apply_As_Vendor_Page Form

**User Story:** As an SME owner, I want a guided application form so that I can apply to participate in a bazaar event with all required information captured in one place.

#### Acceptance Criteria

1. WHEN a user navigates to the path `/apply`, THE Public_Portal SHALL render Apply_As_Vendor_Page within Shared_Layout.
2. THE Apply_As_Vendor_Page SHALL include input fields for: business name, business type, contact email, contact phone, target event (selected from a list of Bazaar_Events), preferred Sponsorship_Package tier, preferred Bazaar_Booth, and a multi-line proposal text area.
3. THE business type field SHALL be a dropdown whose options are exactly the values of `business_type_enum`.
4. THE preferred sponsorship tier field SHALL be a dropdown whose options are exactly the values of `tier_level_enum`.
5. THE target event field SHALL be a dropdown populated by a call to `GET /api/bazaar_events` on Supabase_API_Service.
6. THE proposal text area SHALL accept between 0 and 5000 characters.
7. WHEN the user clicks the "Submit Application" button, THE Public_Portal SHALL POST the form payload to `POST /api/sme_event_applications` on Supabase_API_Service.
8. IF any required field is empty when the user clicks "Submit Application", THEN THE Apply_As_Vendor_Page SHALL highlight each empty field with an inline error message and SHALL NOT send the request.
9. WHEN Supabase_API_Service returns a 2xx response to the application submission, THE Apply_As_Vendor_Page SHALL display a confirmation panel with the new application's identifier and current Application_Status.
10. IF Supabase_API_Service returns a 4xx or 5xx response, THEN THE Apply_As_Vendor_Page SHALL display an inline error message containing the server-provided error description.

### Requirement 5: AI Proposal Generation

**User Story:** As an SME owner who is unsure how to phrase a proposal, I want a button that drafts a proposal for me, so that I can edit a strong starting point instead of facing a blank text area.

#### Acceptance Criteria

1. THE Apply_As_Vendor_Page SHALL display an AI_Proposal_Button labeled "Generate AI Proposal" adjacent to the proposal text area.
2. WHEN the user clicks AI_Proposal_Button, THE Public_Portal SHALL POST the current values of business name, business type, target event, and preferred sponsorship tier to AI_Proposal_Endpoint at `POST /api/proposals/generate`.
3. WHILE AI_Proposal_Endpoint is processing the request, THE AI_Proposal_Button SHALL display a loading state and SHALL be disabled.
4. WHEN AI_Proposal_Endpoint returns a 2xx response with a `draft` field, THE Public_Portal SHALL replace the current value of the proposal text area with the value of the `draft` field.
5. THE proposal text area SHALL remain editable after the draft is inserted.
6. IF AI_Proposal_Endpoint returns a 4xx or 5xx response, THEN THE Apply_As_Vendor_Page SHALL display an inline error message and SHALL NOT modify the proposal text area.
7. IF business name, business type, or target event is missing when AI_Proposal_Button is clicked, THEN THE Apply_As_Vendor_Page SHALL display an inline message naming the missing fields and SHALL NOT send the request.
8. THE AI_Proposal_Endpoint SHALL implement proposal drafting in a new module under `supabase_api/` and SHALL NOT import any module from Existing_Backend.

### Requirement 6: Shared_Layout, Header, and Sidebar

**User Story:** As a user navigating the portal, I want a consistent header and sidebar across pages, so that I can move between sections without re-orienting myself.

#### Acceptance Criteria

1. THE Shared_Layout SHALL be present on Home_Page and Apply_As_Vendor_Page.
2. THE Top_Header SHALL contain, from left to right: a logo linking to `/`, a centered pill-shaped search input, a "Sign in" text link, and a "Join" pill button.
3. WHEN the user clicks the "Sign in" link, THE Public_Portal SHALL open a sign-in modal that submits credentials to `POST /api/auth/login`.
4. WHEN the user clicks the "Join" button, THE Public_Portal SHALL open a registration modal that submits credentials to `POST /api/auth/register`.
5. THE Sidebar_Nav SHALL contain exactly five entries in this order: Home, Events, Apply, Profile, Applications, each with a monochrome line icon and a text label.
6. WHILE the current route matches a Sidebar_Nav entry, THE Sidebar_Nav SHALL render that entry in an active visual state distinct from inactive entries.
7. WHERE the viewport width is less than 768 CSS pixels, THE Sidebar_Nav SHALL collapse into a top-aligned hamburger menu.

### Requirement 7: Google_Skills_Style Compliance

**User Story:** As a designer reviewing the portal, I want every new page to use the documented Google_Skills_Style tokens, so that the visual identity stays consistent.

#### Acceptance Criteria

1. THE Public_Portal SHALL define a single CSS or design-token file that exposes the colors, typography, spacing, and radii listed in §UI Style Reference.
2. THE Public_Portal SHALL use Google blue `#1a73e8` as the background color of all primary CTA pill buttons.
3. THE Public_Portal SHALL use a maximum heading weight of 700 and a body text weight of 400 to 500.
4. THE Public_Portal SHALL render all primary CTA buttons with a fully rounded pill shape (`border-radius` greater than or equal to half the rendered button height).
5. THE Public_Portal SHALL render the Hero_Section search input with a fully rounded pill shape and a visible drop shadow.
6. THE Public_Portal SHALL render Event_Card with a white background, a category label chip, a tier badge chip, a title, a description of at most 160 characters, a duration row with a clock icon, and a circular blue arrow CTA in the bottom-right corner.
7. WHERE the user has set the operating system to a "prefers-reduced-motion" preference, THE Public_Portal SHALL disable decorative motion on illustrations and CTA hover transitions.

### Requirement 8: Authentication Endpoints

**User Story:** As a user, I want to register and log in through the portal so that my application and profile are tied to my account.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/auth/register` that accepts an email, a password, and a display name.
2. WHEN `POST /api/auth/register` is called with a valid payload, THE Supabase_API_Service SHALL create a Supabase Auth user using the Anon_Key client and SHALL return the new user's identifier and access token.
3. THE Supabase_API_Service SHALL expose `POST /api/auth/login` that accepts an email and a password.
4. WHEN `POST /api/auth/login` is called with valid credentials, THE Supabase_API_Service SHALL return a Supabase access token and a refresh token.
5. THE Supabase_API_Service SHALL expose `POST /api/auth/logout` that accepts an access token and revokes the corresponding session.
6. IF an authentication request is missing an email or password, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field names the missing field.
7. IF Supabase Auth rejects the credentials, THEN THE Supabase_API_Service SHALL return HTTP 401 with a JSON body whose `error` field is `invalid_credentials`.
8. THE Supabase_API_Service SHALL never log the value of any password field.

### Requirement 9: SME Profile CRUD

**User Story:** As an SME owner, I want to create, view, update, and delete my SME profile so that my business information stays accurate.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/sme_profiles` that creates a row in the `sme_profile` table.
2. THE Supabase_API_Service SHALL expose `GET /api/sme_profiles` that returns all rows in the `sme_profile` table.
3. THE Supabase_API_Service SHALL expose `GET /api/sme_profiles/{id}` that returns the row whose primary key equals `{id}`.
4. THE Supabase_API_Service SHALL expose `PATCH /api/sme_profiles/{id}` that updates the row whose primary key equals `{id}`.
5. THE Supabase_API_Service SHALL expose `DELETE /api/sme_profiles/{id}` that deletes the row whose primary key equals `{id}`.
6. WHEN a create or update request includes a `business_type` field, THE Supabase_API_Service SHALL reject the request with HTTP 400 if the value is not a member of `business_type_enum`.
7. IF a `GET`, `PATCH`, or `DELETE` request targets an `{id}` that does not exist, THEN THE Supabase_API_Service SHALL return HTTP 404 with a JSON body whose `error` field is `not_found`.

### Requirement 10: Bazaar Event CRUD

**User Story:** As an event organizer, I want CRUD endpoints for bazaar events so that I can manage the catalog of events surfaced on the portal.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/bazaar_events` that creates a row in the `bazaar_events` table.
2. THE Supabase_API_Service SHALL expose `GET /api/bazaar_events` that returns all rows in the `bazaar_events` table.
3. THE Supabase_API_Service SHALL expose `GET /api/bazaar_events/{id}` that returns the matching row or HTTP 404.
4. THE Supabase_API_Service SHALL expose `PATCH /api/bazaar_events/{id}` that updates the matching row.
5. THE Supabase_API_Service SHALL expose `DELETE /api/bazaar_events/{id}` that deletes the matching row.
6. WHEN a create request omits any column marked NOT NULL in the `bazaar_events` schema, THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field names the missing column.

### Requirement 11: Sponsorship Package CRUD

**User Story:** As an event organizer, I want CRUD endpoints for sponsorship packages so that I can publish tiered sponsorship offers tied to a specific event.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/sponsorship_packages` that creates a row in the `sponsorship_package` table.
2. THE Supabase_API_Service SHALL expose `GET /api/sponsorship_packages` that returns all rows in the `sponsorship_package` table.
3. THE Supabase_API_Service SHALL expose `GET /api/sponsorship_packages?event_id={event_id}` that returns rows whose foreign key matches `{event_id}`.
4. THE Supabase_API_Service SHALL expose `PATCH /api/sponsorship_packages/{id}` that updates the matching row.
5. THE Supabase_API_Service SHALL expose `DELETE /api/sponsorship_packages/{id}` that deletes the matching row.
6. IF a create or update request includes a `tier_level` value that is not a member of `tier_level_enum`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field is `invalid_tier_level`.
7. IF a create request references an `event_id` that does not exist in `bazaar_events`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field is `invalid_event_id`.

### Requirement 12: Bazaar Booth CRUD

**User Story:** As an event organizer, I want CRUD endpoints for bazaar booths so that I can manage individual booth slots and their booking status.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/bazaar_booths` that creates a row in the `bazaar_booths` table.
2. THE Supabase_API_Service SHALL expose `GET /api/bazaar_booths` that returns all rows in the `bazaar_booths` table.
3. THE Supabase_API_Service SHALL expose `GET /api/bazaar_booths?event_id={event_id}` that returns rows whose foreign key matches `{event_id}`.
4. THE Supabase_API_Service SHALL expose `PATCH /api/bazaar_booths/{id}` that updates the matching row.
5. THE Supabase_API_Service SHALL expose `DELETE /api/bazaar_booths/{id}` that deletes the matching row.
6. IF a create or update request includes a `booking_status` value that is not a member of `booking_status_enum`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field is `invalid_booking_status`.

### Requirement 13: SME Event Application CRUD

**User Story:** As an SME owner, I want to submit, view, update, and withdraw applications so that I can track my participation in events end to end.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `POST /api/sme_event_applications` that creates a row in the `sme_event_applications` table.
2. THE Supabase_API_Service SHALL expose `GET /api/sme_event_applications` that returns all rows in the `sme_event_applications` table.
3. THE Supabase_API_Service SHALL expose `GET /api/sme_event_applications?sme_id={sme_id}` that returns rows whose foreign key matches `{sme_id}`.
4. THE Supabase_API_Service SHALL expose `PATCH /api/sme_event_applications/{id}` that updates the matching row.
5. THE Supabase_API_Service SHALL expose `DELETE /api/sme_event_applications/{id}` that deletes the matching row.
6. WHEN a create request is processed, THE Supabase_API_Service SHALL set the row's `application_status` field to `pending`.
7. IF an update request includes an `application_status` value that is not a member of `application_status_enum`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field is `invalid_application_status`.
8. WHEN a create request includes a non-empty `proposal` field, THE Supabase_API_Service SHALL persist the value of `proposal` to the corresponding column in `sme_event_applications`.

### Requirement 14: AI Proposal Generation Endpoint

**User Story:** As an SME owner using AI_Proposal_Button, I want a backend endpoint that returns a draft proposal so that the frontend can render it into the form.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose AI_Proposal_Endpoint at `POST /api/proposals/generate`.
2. THE AI_Proposal_Endpoint SHALL accept a JSON body containing `business_name`, `business_type`, `event_id`, and an optional `tier_level` field.
3. WHEN AI_Proposal_Endpoint receives a valid request, THE Supabase_API_Service SHALL return HTTP 200 with a JSON body whose `draft` field is a string between 200 and 2000 characters.
4. IF the request omits `business_name`, `business_type`, or `event_id`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field names the missing field.
5. IF `event_id` does not match any row in `bazaar_events`, THEN THE Supabase_API_Service SHALL return HTTP 400 with a JSON body whose `error` field is `invalid_event_id`.
6. THE AI_Proposal_Endpoint SHALL be implemented in a new module under `supabase_api/` and SHALL NOT import any module from Existing_Backend.
7. WHERE no language model provider is configured, THE AI_Proposal_Endpoint SHALL return a deterministic template-based draft that interpolates `business_name`, `business_type`, and the event title fetched from Supabase.

### Requirement 15: Validation, Error Handling, and Response Shape

**User Story:** As a frontend developer integrating with Supabase_API_Service, I want predictable error shapes so that I can render error messages and retry safely.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL return all successful responses with `Content-Type: application/json`.
2. THE Supabase_API_Service SHALL return all error responses with a JSON body containing at least the fields `error` and `message`.
3. WHEN a request body cannot be parsed as JSON, THE Supabase_API_Service SHALL return HTTP 400 with `error` set to `invalid_json`.
4. IF a Supabase client call raises an exception, THEN THE Supabase_API_Service SHALL return HTTP 502 with `error` set to `supabase_unreachable` and SHALL log the underlying exception class and message.
5. THE Supabase_API_Service SHALL include a `request_id` field of at least 8 characters in every response body to support correlation with logs.

### Requirement 16: Health and Readiness

**User Story:** As an operator running both services, I want a clear way to confirm Supabase_API_Service is up and connected so that I can detect outages quickly.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL expose `GET /api/health` that returns HTTP 200 with a JSON body containing the field `status` set to `healthy` when the process is running.
2. WHEN `GET /api/health` is called, THE Supabase_API_Service SHALL attempt a single read against the `bazaar_events` table and SHALL include the field `supabase` set to `connected` or `disconnected` in the response body.
3. THE `GET /api/health` endpoint SHALL respond within 2 seconds under normal operating conditions.

### Requirement 17: CORS and Cross-Service Integration

**User Story:** As a developer running the portal at one origin and the CRUD service at another, I want CORS configured correctly so that the browser can call Supabase_API_Service from Public_Portal.

#### Acceptance Criteria

1. THE Supabase_API_Service SHALL respond to preflight `OPTIONS` requests with the headers `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.
2. WHERE the environment variable `CORS_ALLOWED_ORIGINS` is set, THE Supabase_API_Service SHALL allow only the comma-separated origins listed in that variable.
3. WHERE `CORS_ALLOWED_ORIGINS` is not set, THE Supabase_API_Service SHALL allow only `http://localhost:5173` and `http://localhost:3000`.

### Requirement 18: Documentation Deliverables

**User Story:** As a new contributor, I want a README that explains how to run both services and where each piece lives so that I can get productive quickly.

#### Acceptance Criteria

1. THE Public_Portal SHALL include a `webapp/README.md` that documents how to install dependencies, set environment variables, and run the dev server.
2. THE Supabase_API_Service SHALL include a `supabase_api/README.md` that documents how to install dependencies, set environment variables, run the service, and lists every endpoint with its method and path.
3. THE `supabase_api/README.md` SHALL include the table of UI Image Assets Required referenced in the appendix below, or a link to this requirements document.

## Appendix A: UI Image Assets Required

The following images and illustrations are required by Public_Portal. Each entry lists a logical asset name, a description, intended placement, suggested format, and target dimensions. Assets MUST be provided as static files under `webapp/public/assets/` and referenced by the documented logical name.

| # | Logical Name | Description | Placement | Format | Target Dimensions |
|---|---|---|---|---|---|
| 1 | `logo.svg` | AmbatuwinCendikiawan wordmark plus mark in Google blue. | Top_Header, footer. | SVG | ~140 × 32 px |
| 2 | `hero-blob-blue-yellow.svg` | Blue circle with overlapping yellow triangles. | Hero_Section background, top-right. | SVG | ~480 × 480 px |
| 3 | `hero-blob-red-heart.svg` | Red heart shape on a soft blue blob. | Hero_Section background, mid-left. | SVG | ~360 × 360 px |
| 4 | `hero-blob-purple-star.svg` | Purple multi-point star on a light blob. | Hero_Section background, bottom-right. | SVG | ~320 × 320 px |
| 5 | `hero-blob-green-semicircle.svg` | Green semicircle paired with a small white dot. | Section transition above "How It Works". | SVG | ~280 × 280 px |
| 6 | `hero-blob-pink-star.svg` | Pink star on a deep blue blob. | Hero_Section background, bottom-left. | SVG | ~300 × 300 px |
| 7 | `hero-illustration-marketplace.svg` | Flat illustration of vendors at colorful booths with a single hero figure presenting. | Hero_Section, right column on desktop. | SVG | ~640 × 480 px |
| 8 | `howitworks-step-1.svg` | Line icon of a clipboard with a checkmark, accented in Google blue. | "How It Works" step 1. | SVG | 64 × 64 px |
| 9 | `howitworks-step-2.svg` | Line icon of two arrows forming a match symbol. | "How It Works" step 2. | SVG | 64 × 64 px |
| 10 | `howitworks-step-3.svg` | Line icon of a storefront with a star above it. | "How It Works" step 3. | SVG | 64 × 64 px |
| 11 | `audience-sme.svg` | Flat illustration of a small business owner behind a market stall. | "Who It's For" SME column. | SVG | ~360 × 280 px |
| 12 | `audience-organizer.svg` | Flat illustration of an organizer with a clipboard at a venue. | "Who It's For" Organizer column. | SVG | ~360 × 280 px |
| 13 | `event-card-placeholder-1.jpg` | Generic bazaar photo placeholder used when an Event_Card has no image. | Event_Card image area. | JPG | 800 × 450 px |
| 14 | `event-card-placeholder-2.jpg` | Alternate bazaar photo placeholder. | Event_Card image area. | JPG | 800 × 450 px |
| 15 | `event-card-placeholder-3.jpg` | Alternate bazaar photo placeholder. | Event_Card image area. | JPG | 800 × 450 px |
| 16 | `event-card-arrow-cta.svg` | Circular blue arrow CTA used in the bottom-right of every Event_Card. | Event_Card CTA. | SVG | 40 × 40 px |
| 17 | `dark-section-bg-blob.svg` | Faint multi-color blob art used as background texture. | Dark_Feature_Section background. | SVG | ~1440 × 480 px |
| 18 | `apply-decorative-blob-left.svg` | Soft blue blob with yellow accents. | Apply_As_Vendor_Page Hero_Section, left side. | SVG | ~360 × 360 px |
| 19 | `apply-decorative-blob-right.svg` | Pink star with green semicircle accent. | Apply_As_Vendor_Page Hero_Section, right side. | SVG | ~360 × 360 px |
| 20 | `ai-proposal-icon.svg` | Sparkle plus document outline icon, in Google blue. | Inside AI_Proposal_Button to its left. | SVG | 20 × 20 px |
| 21 | `sidebar-icon-home.svg` | Monochrome line icon of a house. | Sidebar_Nav, Home entry. | SVG | 24 × 24 px |
| 22 | `sidebar-icon-events.svg` | Monochrome line icon of a calendar. | Sidebar_Nav, Events entry. | SVG | 24 × 24 px |
| 23 | `sidebar-icon-apply.svg` | Monochrome line icon of a paper plane. | Sidebar_Nav, Apply entry. | SVG | 24 × 24 px |
| 24 | `sidebar-icon-profile.svg` | Monochrome line icon of a user silhouette. | Sidebar_Nav, Profile entry. | SVG | 24 × 24 px |
| 25 | `sidebar-icon-applications.svg` | Monochrome line icon of a stacked-document tray. | Sidebar_Nav, Applications entry. | SVG | 24 × 24 px |
| 26 | `header-icon-search.svg` | Monochrome line icon of a magnifying glass. | Inside the Top_Header search input, leading edge. | SVG | 20 × 20 px |
| 27 | `card-icon-clock.svg` | Monochrome line icon of a clock. | Event_Card duration row, left of the duration text. | SVG | 16 × 16 px |
| 28 | `favicon.ico` | 32 × 32 favicon featuring the logo mark. | `webapp/public/favicon.ico`. | ICO | 32 × 32 px |
| 29 | `og-home.png` | Open Graph share image with hero illustration and headline. | `<meta property="og:image">` for `/`. | PNG | 1200 × 630 px |
| 30 | `og-apply.png` | Open Graph share image for the Apply page. | `<meta property="og:image">` for `/apply`. | PNG | 1200 × 630 px |

## Appendix B: Default Decisions Recorded

The following decisions were chosen as defaults for this spec without further user clarification:

- **Frontend stack**: Vite + React 18 + TypeScript, in `webapp/`.
- **Backend stack**: FastAPI + `supabase-py`, in `supabase_api/`.
- **Default ports**: Public_Portal dev server on `5173`, Supabase_API_Service on `8000`, Existing_Backend remains on `5000`.
- **CORS default origins**: `http://localhost:5173`, `http://localhost:3000`.
- **Enum source of truth**: PostgreSQL enums defined in Supabase as documented in `Amba.txt`.
- **AI proposal fallback**: When no language model provider is configured, AI_Proposal_Endpoint returns a deterministic template-based draft so that the feature works end-to-end out of the box.
