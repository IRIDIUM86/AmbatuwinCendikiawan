import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Profile() {
  // Form data state with all 9 profile fields
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    business_category: '',
    phone: '',
    email: '',
    website: '',
    can_sponsor: false,
    can_bazaar_vendor: false,
    bazaar_booth_budget_range: ''
  });

  // Errors state object for validation messages
  const [errors, setErrors] = useState({});

  // Loading state for data fetching operations
  const [loading, setLoading] = useState(false);

  // Saving state for save operations
  const [saving, setSaving] = useState(false);

  // Message state for success/error messages
  const [message, setMessage] = useState(null);

  // Session state for user authentication
  const [session, setSession] = useState(null);

  // Profile exists state to determine insert vs update
  const [profileExists, setProfileExists] = useState(false);

  /**
   * useEffect hook to retrieve user session on component mount
   * Requirements: 3.1, 6.1
   * 
   * Retrieves the current user session from Supabase Auth when the component mounts.
   * Sets loading state during retrieval and implements a 5-second timeout.
   */
  useEffect(() => {
    const getSession = async () => {
      // Set loading state during session retrieval (Requirement 3.1)
      setLoading(true);
      
      try {
        // Create a timeout promise that rejects after 5 seconds (Requirement 3.1)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session retrieval timed out')), 5000);
        });
        
        // Call supabase.auth.getSession() when component mounts (Requirement 6.1)
        const sessionPromise = supabase.auth.getSession();
        
        // Race between session retrieval and timeout (Requirement 3.1)
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (error) {
          console.error('Error retrieving session:', error);
          setMessage({
            type: 'error',
            text: 'Failed to retrieve session. Please refresh the page.'
          });
        } else {
          // Set session state with retrieved session (Requirement 6.1)
          setSession(data.session);
        }
      } catch (error) {
        console.error('Session retrieval error:', error);
        
        // Display timeout error if session retrieval exceeds 5 seconds (Requirement 3.1)
        if (error.message === 'Session retrieval timed out') {
          setMessage({
            type: 'error',
            text: 'Session retrieval timed out. Please refresh the page.'
          });
        } else {
          setMessage({
            type: 'error',
            text: 'Failed to retrieve session. Please refresh the page.'
          });
        }
      } finally {
        // Clear loading state after session retrieval completes
        setLoading(false);
      }
    };
    
    getSession();
  }, []); // Empty dependency array ensures this runs only on mount

  /**
   * useEffect hook to load existing profile data
   * Requirements: 3.1, 3.3, 3.4, 3.9, 6.7
   * 
   * Queries the sme_profiles table for existing profile data when a session exists.
   * Populates form fields with retrieved data and sets profileExists state.
   * Implements a 5-second timeout for the query operation.
   */
  useEffect(() => {
    // Only execute if session exists (Requirement 3.1)
    if (!session) {
      return;
    }

    const loadProfileData = async () => {
      // Set loading state during query operation (Requirement 3.1)
      setLoading(true);
      
      try {
        // Create a timeout promise that rejects after 5 seconds (Requirement 3.9)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timed out')), 5000);
        });
        
        // Query sme_profile table filtered by user_id from session (Requirement 3.3, 6.7)
        const queryPromise = supabase
          .from('sme_profile')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        // Race between query and timeout (Requirement 3.9)
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
        
        if (error) {
          // If error code is PGRST116, it means no rows found (profile doesn't exist)
          if (error.code === 'PGRST116') {
            // Set profileExists to false (Requirement 3.3)
            setProfileExists(false);
            // No error message needed - this is expected for new users
          } else {
            console.error('Error loading profile data:', error);
            setMessage({
              type: 'error',
              text: 'Failed to load profile data. Please refresh the page.'
            });
          }
        } else if (data) {
          // Set profileExists state based on query result (Requirement 3.3)
          setProfileExists(true);
          
          // Populate formData state with retrieved profile data (Requirement 3.4)
          setFormData({
            business_name: data.business_name || '',
            business_type: data.business_type || '',
            business_category: data.business_category || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            can_sponsor: data.can_sponsor || false,
            can_bazaar_vendor: data.can_bazaar_vendor || false,
            bazaar_booth_budget_range: data.bazaar_booth_budget_range || ''
          });
        }
      } catch (error) {
        console.error('Profile data loading error:', error);
        
        // Display timeout error if query exceeds 5 seconds (Requirement 3.9)
        if (error.message === 'Query timed out') {
          setMessage({
            type: 'error',
            text: 'Profile data loading timed out. Please try again.'
          });
        } else {
          setMessage({
            type: 'error',
            text: 'Failed to load profile data. Please refresh the page.'
          });
        }
      } finally {
        // Clear loading state after query operation completes
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [session]); // Dependency on session ensures this runs when session is set

  /**
   * Validates required fields: business_name and business_type
   * Requirements: 1.11, 1.12, 5.1, 5.2, 7.1, 7.2
   * 
   * @param {Object} data - Form data to validate
   * @returns {Object} - Errors object with field-specific error messages
   */
  const validateRequiredFields = (data) => {
    const validationErrors = {};

    // Validate business_name is not empty (Requirement 5.1)
    if (!data.business_name || data.business_name.trim() === '') {
      validationErrors.business_name = 'Business name is required';
    }
    // Validate business_name does not exceed 255 characters (Requirement 7.1)
    else if (data.business_name.length > 255) {
      validationErrors.business_name = 'Business name must not exceed 255 characters';
    }

    // Validate business_type is selected (Requirement 5.2)
    if (!data.business_type || data.business_type === '') {
      validationErrors.business_type = 'Business type is required';
    }

    return validationErrors;
  };

  /**
   * Validates field length constraints for all form fields
   * Requirements: 2.3, 7.1, 7.3, 7.4, 7.5, 7.6, 7.13
   * 
   * @param {Object} data - Form data to validate
   * @returns {Object} - Errors object with field-specific error messages
   */
  const validateFieldLengths = (data) => {
    const validationErrors = {};

    // Validate business_name max 255 characters (Requirement 7.1)
    if (data.business_name && data.business_name.length > 255) {
      validationErrors.business_name = 'Business name must not exceed 255 characters';
    }

    // Validate business_category max 100 characters (Requirement 7.3)
    if (data.business_category && data.business_category.length > 100) {
      validationErrors.business_category = 'Business category must not exceed 100 characters';
    }

    // Validate phone min 10, max 20 characters (Requirement 7.4)
    if (data.phone) {
      if (data.phone.length < 10) {
        validationErrors.phone = 'Phone must be at least 10 characters';
      } else if (data.phone.length > 20) {
        validationErrors.phone = 'Phone must not exceed 20 characters';
      }
    }

    // Validate email max 254 characters (Requirement 7.5)
    if (data.email && data.email.length > 254) {
      validationErrors.email = 'Email must not exceed 254 characters';
    }

    // Validate website max 2048 characters (Requirement 7.6)
    if (data.website && data.website.length > 2048) {
      validationErrors.website = 'Website must not exceed 2048 characters';
    }

    return validationErrors;
  };

  /**
   * Validates website format
   * Requirements: 1.14, 1.15, 7.6
   * 
   * @param {Object} data - Form data to validate
   * @returns {Object} - Errors object with field-specific error messages
   */
  const validateWebsiteFormat = (data) => {
    const validationErrors = {};

    // Only validate if website field is populated (Requirement 1.14)
    if (data.website && data.website.trim() !== '') {
      const website = data.website.trim();

      // Validate website starts with http:// or https:// (Requirement 1.14)
      if (!website.startsWith('http://') && !website.startsWith('https://')) {
        validationErrors.website = 'Website must start with http:// or https://';
      }
      // Validate website does not exceed 2048 characters (Requirement 7.6)
      else if (website.length > 2048) {
        validationErrors.website = 'Website must not exceed 2048 characters';
      }
    }

    return validationErrors;
  };

  /**
   * Validates email format
   * Requirements: 1.13, 1.15, 5.3, 7.5
   * 
   * @param {Object} data - Form data to validate
   * @returns {Object} - Errors object with field-specific error messages
   */
  const validateEmailFormat = (data) => {
    const validationErrors = {};

    // Only validate if email field is populated (Requirement 5.3)
    if (data.email && data.email.trim() !== '') {
      const email = data.email.trim();

      // Validate email does not exceed 254 characters (Requirement 7.5)
      if (email.length > 254) {
        validationErrors.email = 'Email must not exceed 254 characters';
      } else {
        // Validate email contains @ symbol (Requirement 1.13)
        const atIndex = email.indexOf('@');
        
        if (atIndex === -1) {
          validationErrors.email = 'Email must contain @ with characters before and after, and at least one dot after @';
        } else {
          // Validate at least one character before @ (Requirement 1.13)
          if (atIndex === 0) {
            validationErrors.email = 'Email must contain @ with characters before and after, and at least one dot after @';
          }
          // Validate at least one character after @ (Requirement 1.13)
          else if (atIndex === email.length - 1) {
            validationErrors.email = 'Email must contain @ with characters before and after, and at least one dot after @';
          }
          // Validate at least one dot after @ (Requirement 5.3)
          else {
            const afterAt = email.substring(atIndex + 1);
            if (!afterAt.includes('.')) {
              validationErrors.email = 'Email must contain @ with characters before and after, and at least one dot after @';
            }
          }
        }
      }
    }

    return validationErrors;
  };

  /**
   * Validates enum values for business_type and bazaar_booth_budget_range
   * Requirements: 7.2, 7.9, 7.11, 7.12
   * 
   * @param {Object} data - Form data to validate
   * @returns {Object} - Errors object with field-specific error messages
   */
  const validateEnumValues = (data) => {
    const validationErrors = {};

    // Valid business_type enum values (Requirement 7.2)
    const validBusinessTypes = [
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
    ];

    // Valid bazaar_booth_budget_range values (Requirement 7.9)
    const validBudgetRanges = ['budget', 'mid-range', 'premium'];

    // Validate business_type is one of the valid enum values (Requirement 7.2, 7.11)
    if (data.business_type && !validBusinessTypes.includes(data.business_type)) {
      validationErrors.business_type = 'Invalid business type selected';
    }

    // Validate bazaar_booth_budget_range is one of the valid values if populated (Requirement 7.9, 7.12)
    if (data.bazaar_booth_budget_range && data.bazaar_booth_budget_range !== '' && !validBudgetRanges.includes(data.bazaar_booth_budget_range)) {
      validationErrors.bazaar_booth_budget_range = 'Invalid budget range selected';
    }

    return validationErrors;
  };

  /**
   * Handle input changes and clear field-specific errors
   * Requirements: 5.7
   * 
   * When a user modifies a field that previously failed validation,
   * clear the error message for that field while preserving errors for other fields
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this specific field if it exists (Requirement 5.7)
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Handle form submission with validation and save to database
   * Requirements: 1.11, 1.12, 2.2, 2.3, 2.4, 5.4, 5.5, 2.5, 2.6, 2.7, 6.5, 6.8, 2.10, 7.14, 1.16, 2.8, 2.9
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior (Requirement 1.11)
    e.preventDefault();
    
    // Clear previous errors before new validation (Requirement 5.6)
    setErrors({});
    setMessage(null);
    
    // Set saving state to true during operation (Requirement 1.11)
    setSaving(true);
    
    try {
      // Call all validation functions and check for errors (Requirement 1.11, 5.4)
      const requiredFieldErrors = validateRequiredFields(formData);
      const fieldLengthErrors = validateFieldLengths(formData);
      const emailFormatErrors = validateEmailFormat(formData);
      const websiteFormatErrors = validateWebsiteFormat(formData);
      const enumErrors = validateEnumValues(formData);
      
      // Merge all validation errors
      const allErrors = {
        ...requiredFieldErrors,
        ...fieldLengthErrors,
        ...emailFormatErrors,
        ...websiteFormatErrors,
        ...enumErrors
      };
      
      // If validation fails, display errors and return early (Requirement 1.12, 2.2)
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        setSaving(false);
        return;
      }
      
      // If no session exists, display authentication error and return early (Requirement 2.4)
      if (!session || !session.user || !session.user.id) {
        setMessage({
          type: 'error',
          text: 'Authentication is required to save your profile. Please log in.'
        });
        setSaving(false);
        return;
      }
      
      // Convert empty strings to null for optional fields (Requirement 7.14, Task 6.3)
      const profileData = {
        business_name: formData.business_name,
        business_type: formData.business_type,
        business_category: formData.business_category.trim() === '' ? null : formData.business_category,
        phone: formData.phone.trim() === '' ? null : formData.phone,
        email: formData.email.trim() === '' ? null : formData.email,
        website: formData.website.trim() === '' ? null : formData.website,
        can_sponsor: formData.can_sponsor,
        can_bazaar_vendor: formData.can_bazaar_vendor,
        bazaar_booth_budget_range: formData.bazaar_booth_budget_range === '' ? null : formData.bazaar_booth_budget_range,
        user_id: session.user.id // Include user_id from session (Requirement 6.5, 6.8)
      };
      
      // Create a timeout promise that rejects after 30 seconds (Requirement 2.10)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Save operation timed out')), 30000);
      });
      
      let savePromise;
      
      // Check profileExists state to determine operation type (Requirement 2.5, Task 6.2)
      if (profileExists) {
        // If profileExists is true, perform UPDATE operation (Requirement 2.6)
        savePromise = supabase
          .from('sme_profile')
          .update(profileData)
          .eq('user_id', session.user.id);
      } else {
        // If profileExists is false, perform INSERT operation (Requirement 2.7)
        savePromise = supabase
          .from('sme_profile')
          .insert([profileData]);
      }
      
      // Race between save operation and timeout (Requirement 2.10)
      const { error } = await Promise.race([savePromise, timeoutPromise]);
      
      if (error) {
        // Display error message with failure reason if operation fails (Requirement 2.9)
        console.error('Error saving profile:', error);
        setMessage({
          type: 'error',
          text: `Failed to save profile: ${error.message}`
        });
      } else {
        // If this was an insert, update profileExists state
        if (!profileExists) {
          setProfileExists(true);
        }
        
        // Display success message for minimum 3 seconds after successful save (Requirement 2.8)
        setMessage({
          type: 'success',
          text: 'Profile saved successfully!'
        });
        
        // Keep success message visible for minimum 3 seconds (Requirement 2.8)
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch (error) {
      // Log errors to console for debugging (Requirement 2.9)
      console.error('Save operation error:', error);
      
      // Display timeout error if operation exceeds 30 seconds (Requirement 2.10)
      if (error.message === 'Save operation timed out') {
        setMessage({
          type: 'error',
          text: 'Save operation timed out. Please try again.'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'An unexpected error occurred while saving your profile. Please try again.'
        });
      }
    } finally {
      // Set saving state to false after operation completes (Requirement 2.9)
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SME Business Profile</h1>
        
        {/* Display error message banner if present */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* Display login prompt when session is null or undefined (Requirement 6.2) */}
        {!loading && !session && (
          <div className="mb-6 p-4 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
            Please log in to create or edit your profile.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label 
              htmlFor="business_name" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Name *
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your business name"
            />
            {errors.business_name && (
              <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label 
              htmlFor="business_type" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Type *
            </label>
            <select
              id="business_type"
              name="business_type"
              value={formData.business_type}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a business type</option>
              <option value="food_beverage">Food & Beverage</option>
              <option value="retail">Retail</option>
              <option value="technology">Technology</option>
              <option value="services">Services</option>
              <option value="health_wellness">Health & Wellness</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="fashion">Fashion</option>
              <option value="home_garden">Home & Garden</option>
              <option value="automotive">Automotive</option>
              <option value="finance">Finance</option>
              <option value="real_estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
            {errors.business_type && (
              <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>
            )}
          </div>

          {/* Business Category */}
          <div>
            <label 
              htmlFor="business_category" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Category
            </label>
            <input
              type="text"
              id="business_category"
              name="business_category"
              value={formData.business_category}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Organic Food, Tech Consulting"
            />
            {errors.business_category && (
              <p className="mt-1 text-sm text-red-600">{errors.business_category}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., +60123456789"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="business@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label 
              htmlFor="website" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="https://www.example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          {/* Can Sponsor Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_sponsor"
              name="can_sponsor"
              checked={formData.can_sponsor}
              onChange={handleInputChange}
              disabled={!session}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label 
              htmlFor="can_sponsor" 
              className="ml-3 text-sm font-medium text-gray-700"
            >
              Available to sponsor events
            </label>
          </div>

          {/* Can Bazaar Vendor Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="can_bazaar_vendor"
              name="can_bazaar_vendor"
              checked={formData.can_bazaar_vendor}
              onChange={handleInputChange}
              disabled={!session}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label 
              htmlFor="can_bazaar_vendor" 
              className="ml-3 text-sm font-medium text-gray-700"
            >
              Available as bazaar vendor
            </label>
          </div>

          {/* Bazaar Booth Budget Range */}
          <div>
            <label 
              htmlFor="bazaar_booth_budget_range" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bazaar Booth Budget Range
            </label>
            <select
              id="bazaar_booth_budget_range"
              name="bazaar_booth_budget_range"
              value={formData.bazaar_booth_budget_range}
              onChange={handleInputChange}
              disabled={!session}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a budget range</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-Range</option>
              <option value="premium">Premium</option>
            </select>
            {errors.bazaar_booth_budget_range && (
              <p className="mt-1 text-sm text-red-600">{errors.bazaar_booth_budget_range}</p>
            )}
          </div>

          {/* Save Profile Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!session || saving}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
