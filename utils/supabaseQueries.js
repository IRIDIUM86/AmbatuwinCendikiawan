import { supabase } from '../supabaseClient'

/**
 * Fetch all events from bazaar_events_Table
 * 
 * Retrieves all required fields:
 * - event_name: string
 * - event_type: string
 * - description: string
 * - city: string
 * - state: string
 * - venue_name: string
 * - event_date: date
 * - start_time: time
 * - end_time: time
 * - target_industries: array/string
 * - target_audience: string
 * - expected_footfall: number
 * - cover_image_url: string
 * - status: string (upcoming, ongoing, completed)
 * - is_featured: boolean
 * 
 * @returns {Promise<Array>} Array of event objects
 * @throws {Error} If query fails
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8
 */
export async function fetchAllEvents() {
  try {
    const { data, error } = await supabase
      .from('bazaar_events_Table')
      .select('*')

    if (error) {
      throw new Error(error.message || 'Failed to fetch events from Supabase')
    }

    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected array of events')
    }

    return data || []
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch events')
  }
}

/**
 * Fetch all events with retry mechanism
 * 
 * Attempts to fetch events with exponential backoff retry logic.
 * Retries up to 3 times with increasing delays (1s, 2s, 4s).
 * 
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<Array>} Array of event objects
 * @throws {Error} If all retry attempts fail
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8
 */
export async function fetchAllEventsWithRetry(maxRetries = 3, initialDelay = 1000) {
  let lastError = null
  let delay = initialDelay

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchAllEvents()
    } catch (err) {
      lastError = err
      
      // Don't retry on the last attempt
      if (attempt < maxRetries - 1) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2
      }
    }
  }

  throw new Error(
    lastError?.message || 'Failed to fetch events after multiple retry attempts'
  )
}

/**
 * Validate event data structure
 * 
 * Checks that an event object contains all required fields.
 * 
 * @param {Object} event - Event object to validate
 * @returns {boolean} True if event is valid, false otherwise
 */
export function validateEventData(event) {
  if (!event || typeof event !== 'object') {
    return false
  }

  const requiredFields = [
    'event_name',
    'event_type',
    'description',
    'city',
    'state',
    'venue_name',
    'event_date',
    'start_time',
    'end_time',
    'target_industries',
    'target_audience',
    'expected_footfall',
    'cover_image_url',
    'status',
    'is_featured'
  ]

  return requiredFields.every(field => field in event)
}

/**
 * Filter events by type
 * 
 * @param {Array} events - Array of event objects
 * @param {string} eventType - Event type to filter by
 * @returns {Array} Filtered array of events
 */
export function filterEventsByType(events, eventType) {
  if (!eventType) {
    return events
  }
  return events.filter(event => event.event_type === eventType)
}

/**
 * Filter events by location
 * 
 * @param {Array} events - Array of event objects
 * @param {string} city - City to filter by
 * @param {string} state - State to filter by
 * @returns {Array} Filtered array of events
 */
export function filterEventsByLocation(events, city, state) {
  if (!city || !state) {
    return events
  }
  return events.filter(event => event.city === city && event.state === state)
}

/**
 * Get unique event types from events array
 * 
 * @param {Array} events - Array of event objects
 * @returns {Array} Sorted array of unique event types
 */
export function getUniqueEventTypes(events) {
  const types = events
    .map(event => event.event_type)
    .filter(Boolean)
  return [...new Set(types)].sort()
}

/**
 * Get unique locations from events array
 * 
 * @param {Array} events - Array of event objects
 * @returns {Array} Sorted array of unique locations (formatted as "City, State")
 */
export function getUniqueLocations(events) {
  const locations = events
    .filter(event => event.city && event.state) // Filter out incomplete locations
    .map(event => `${event.city}, ${event.state}`)
    .filter(Boolean)
  return [...new Set(locations)].sort()
}
