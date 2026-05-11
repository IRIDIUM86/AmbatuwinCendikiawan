-- ============================================
-- EXTENSIONS (Enable pgvector for embeddings)
-- ============================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SME PROFILES (General - not just food vendors)
-- ============================================

CREATE TABLE sme_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  business_name VARCHAR(255) NOT NULL,
  
  -- Business Classification
  business_type ENUM(
    'food_beverage',
    'retail',
    'technology',
    'services',
    'health_wellness',
    'education',
    'entertainment',
    'fashion',
    'home_garden',
    'automotive',
    'finance',
    'real_estate',
    'other'
  ) NOT NULL,
  
  business_category VARCHAR(100), -- e.g., 'Restaurant', 'Clothing Store', 'Consulting'
  business_description TEXT, -- detailed description of business
  
  -- Business Profile
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url VARCHAR(255),
  banner_image_url VARCHAR(255),
  
  -- Business Capabilities
  -- What types of participation can this SME do?
  can_sponsor BOOLEAN DEFAULT TRUE, -- Can participate as sponsor
  can_bazaar_vendor BOOLEAN DEFAULT TRUE, -- Can set up booth/stall
  
  -- Participation Interests (from AI parser)
  preferred_event_types JSONB, -- array: ['bazaar', 'expo', 'festival', 'trade_show']
  preferred_industries JSONB, -- array of industries they want to target
  business_tags JSONB, -- array: ['eco-friendly', 'local', 'premium', 'family-friendly']
  target_audience JSONB, -- e.g., {'age_range': '25-45', 'demographics': ['professionals', 'families']}
  
  -- Budget & Preferences
  sponsorship_budget_range VARCHAR(50), -- 'minimal', 'moderate', 'substantial'
  bazaar_booth_budget_range VARCHAR(50), -- 'budget', 'mid-range', 'premium'
  preferred_booth_size VARCHAR(50), -- e.g., '3x3', '5x5', '10x10'
  
  -- AI-Generated Embedding (for semantic search)
  business_embedding vector(1536), -- embeddings from Claude/Bedrock
  
  -- Verification & Status
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_business_type (business_type),
  INDEX idx_business_category (business_category),
  INDEX idx_can_sponsor (can_sponsor),
  INDEX idx_can_bazaar_vendor (can_bazaar_vendor)
);

-- ============================================
-- SME LOCATIONS (Multiple branches/offices)
-- ============================================

CREATE TABLE sme_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id UUID NOT NULL,
  location_name VARCHAR(255), -- e.g., 'Headquarters', 'Branch 1'
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  is_primary BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
  INDEX idx_sme_locations (sme_id)
);

-- ============================================
-- BAZAAR/EVENTS (Static initially, can add CRUD)
-- ============================================

CREATE TABLE bazaar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(255) NOT NULL,
  
  -- Event Details
  event_type ENUM(
    'bazaar',
    'expo',
    'festival',
    'trade_show',
    'pop_up',
    'night_market',
    'other'
  ) NOT NULL,
  description TEXT,
  
  -- Location
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  venue_name VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Dates
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_days INTEGER,
  
  -- Event Target & Focus
  target_industries JSONB, -- array: ['food', 'retail', 'tech', 'services']
  target_audience JSONB, -- array: ['families', 'professionals', 'young_adults']
  expected_footfall INTEGER,
  
  -- Event Description for AI Matching
  event_keywords JSONB, -- array of keywords for semantic search
  event_embedding vector(1536), -- embeddings from Claude/Bedrock
  
  -- Images
  cover_image_url VARCHAR(255),
  event_images JSONB, -- array of image URLs
  
  -- Status
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_event_date (event_date),
  INDEX idx_city (city),
  INDEX idx_event_type (event_type),
  INDEX idx_status (status)
);

-- ============================================
-- SPONSORSHIP PACKAGES
-- ============================================

CREATE TABLE sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  package_code VARCHAR(50) UNIQUE,
  
  -- Tier Information
  tier_level ENUM('platinum', 'gold', 'silver', 'bronze', 'standard') NOT NULL,
  description TEXT,
  
  -- Pricing
  price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MYR',
  
  -- Benefits/Inclusions
  benefits JSONB, -- array of benefit descriptions
  logo_placement_positions JSONB, -- where logo appears (e.g., 'banner', 'website', 'program')
  number_of_passes INTEGER, -- event passes/tickets included
  booth_space BOOLEAN DEFAULT FALSE, -- does sponsorship include booth space?
  booth_size VARCHAR(50), -- if yes, size
  speaking_slot BOOLEAN DEFAULT FALSE,
  media_mentions BOOLEAN DEFAULT FALSE,
  social_media_promotion BOOLEAN DEFAULT FALSE,
  additional_perks TEXT,
  
  -- Availability
  quantity_available INTEGER,
  quantity_sold INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (event_id) REFERENCES bazaar_events(id) ON DELETE CASCADE,
  INDEX idx_sponsorship_event (event_id),
  INDEX idx_sponsorship_tier (tier_level)
);

-- ============================================
-- BAZAAR BOOTHS/STALLS
-- ============================================

CREATE TABLE bazaar_booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  booth_number VARCHAR(50) NOT NULL,
  section VARCHAR(100), -- e.g., 'Section A', 'Food Court', 'Tech Zone'
  
  -- Booth Configuration
  booth_size VARCHAR(50), -- e.g., '3x3', '5x5', '10x10'
  booth_type VARCHAR(100), -- 'standard', 'corner', 'premium', 'food_stall'
  price DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'MYR',
  
  -- Booth Features
  has_electricity BOOLEAN DEFAULT FALSE,
  has_water BOOLEAN DEFAULT FALSE,
  has_storage BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  features JSONB, -- other features: {'wifi': true, 'tables': 2, 'chairs': 4}
  
  -- Suitability
  suitable_for JSONB, -- array: ['food_vendors', 'retail', 'services']
  restrictions JSONB, -- restrictions for this booth
  
  -- Availability & Booking
  is_available BOOLEAN DEFAULT TRUE,
  sme_id UUID, -- NULL if not booked
  booking_status ENUM('available', 'reserved', 'confirmed', 'cancelled') DEFAULT 'available',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(event_id, booth_number),
  FOREIGN KEY (event_id) REFERENCES bazaar_events(id) ON DELETE CASCADE,
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE SET NULL,
  INDEX idx_bazaar_event (event_id),
  INDEX idx_bazaar_sme (sme_id),
  INDEX idx_bazaar_availability (is_available)
);

-- ============================================
-- SME EVENT APPLICATIONS
-- ============================================

CREATE TABLE sme_event_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id UUID NOT NULL,
  event_id UUID NOT NULL,
  
  -- Application Type & Status
  application_type ENUM('sponsorship', 'bazaar_vendor', 'both') NOT NULL,
  overall_status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled') DEFAULT 'draft',
  
  -- Sponsorship Application
  sponsorship_package_id UUID,
  sponsorship_status ENUM('pending', 'approved', 'paid', 'rejected') DEFAULT 'pending',
  sponsorship_amount DECIMAL(12, 2),
  sponsorship_tier ENUM('platinum', 'gold', 'silver', 'bronze', 'standard'),
  
  -- Bazaar Application
  bazaar_booth_id UUID,
  bazaar_status ENUM('pending', 'approved', 'paid', 'rejected') DEFAULT 'pending',
  bazaar_booth_size VARCHAR(50),
  bazaar_booth_price DECIMAL(12, 2),
  
  -- Application Details
  application_message TEXT, -- cover letter from SME
  business_documents JSONB, -- URLs to business license, certificate, portfolio, etc.
  
  -- AI Matching Score
  match_score DECIMAL(5, 2), -- 0-100 from AI analysis
  match_reasons JSONB, -- array of reasons for match/recommendation
  
  -- Timeline
  submitted_at TIMESTAMP,
  review_started_at TIMESTAMP,
  decision_date TIMESTAMP,
  decision_notes TEXT,
  approved_by_user_id UUID, -- admin/organizer who approved
  
  -- Payment
  total_amount DECIMAL(12, 2),
  payment_status ENUM('pending', 'paid', 'cancelled', 'refunded') DEFAULT 'pending',
  invoice_id UUID,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(sme_id, event_id),
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES bazaar_events(id) ON DELETE CASCADE,
  FOREIGN KEY (sponsorship_package_id) REFERENCES sponsorship_packages(id) ON DELETE SET NULL,
  FOREIGN KEY (bazaar_booth_id) REFERENCES bazaar_booths(id) ON DELETE SET NULL,
  INDEX idx_application_status (overall_status),
  INDEX idx_sme_event (sme_id, event_id),
  INDEX idx_application_event (event_id),
  INDEX idx_sponsorship_status (sponsorship_status),
  INDEX idx_bazaar_status (bazaar_status)
);

-- ============================================
-- SME-EVENT MATCHES (from AI parser)
-- ============================================

CREATE TABLE sme_event_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id UUID NOT NULL,
  event_id UUID NOT NULL,
  
  -- Match Analysis
  match_score DECIMAL(5, 2), -- 0-100 confidence score
  match_type ENUM('sponsorship', 'bazaar_vendor', 'both') NOT NULL,
  match_reasons JSONB, -- why this match was made
  matching_keywords JSONB, -- keywords that matched
  
  -- Recommendation Status
  is_recommended BOOLEAN DEFAULT FALSE,
  recommendation_sent_at TIMESTAMP,
  
  -- SME Action on Recommendation
  sme_action ENUM('ignored', 'interested', 'applied', 'rejected') DEFAULT 'ignored',
  sme_action_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(sme_id, event_id),
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES bazaar_events(id) ON DELETE CASCADE,
  INDEX idx_match_score (match_score DESC),
  INDEX idx_sme_matches (sme_id),
  INDEX idx_event_matches (event_id)
);

-- ============================================
-- VECTOR INDEXES FOR SIMILARITY SEARCH
-- ============================================

CREATE INDEX idx_sme_embedding ON sme_profiles USING ivfflat (business_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_event_embedding ON bazaar_events USING ivfflat (event_embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================
-- SME PREFERENCES & INTERESTS
-- ============================================

CREATE TABLE sme_event_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id UUID NOT NULL UNIQUE,
  
  -- Event Preferences
  preferred_event_types JSONB, -- array: ['bazaar', 'expo', 'festival']
  preferred_industries JSONB, -- array of industries
  preferred_locations JSONB, -- array of cities/regions
  
  -- Budget Preferences
  max_sponsorship_budget DECIMAL(12, 2),
  max_booth_budget DECIMAL(12, 2),
  
  -- Notification Settings
  receive_recommendations BOOLEAN DEFAULT TRUE,
  receive_newsletters BOOLEAN DEFAULT TRUE,
  notification_frequency VARCHAR(50), -- 'immediate', 'daily', 'weekly'
  
  -- Preferences Data
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE
);

-- ============================================
-- EVENT HISTORY & REVIEWS
-- ============================================

CREATE TABLE sme_event_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sme_id UUID NOT NULL,
  event_id UUID NOT NULL,
  
  participation_type ENUM('sponsor', 'bazaar_vendor', 'both') NOT NULL,
  
  -- Performance Data
  sponsorship_amount_paid DECIMAL(12, 2),
  booth_revenue DECIMAL(12, 2),
  customer_footfall INTEGER,
  leads_generated INTEGER,
  sales_made INTEGER,
  
  -- Feedback & Ratings (both ways)
  organizer_rating INTEGER CHECK (organizer_rating >= 1 AND organizer_rating <= 5),
  organizer_review TEXT,
  sme_rating INTEGER CHECK (sme_rating >= 1 AND sme_rating <= 5),
  sme_review TEXT,
  
  notes TEXT,
  event_completed_at TIMESTAMP,
  
  FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES bazaar_events(id) ON DELETE CASCADE,
  INDEX idx_sme_history (sme_id),
  INDEX idx_event_history (event_id)
);
