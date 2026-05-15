/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import API_CONFIG from '../config/api'

class APIService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  /**
   * Generic request handler with timeout and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal,
      ...options
    }

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
        }
        
        throw new Error(errorMessage)
      }

      // Parse JSON response
      const data = await response.json()
      return data
      
    } catch (error) {
      clearTimeout(timeoutId)
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.')
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
      
      // Re-throw other errors
      throw error
    }
  }

  /**
   * Health Check
   * GET /api/health
   */
  async healthCheck() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH)
  }

  /**
   * Get All Events
   * GET /api/events/all
   */
  async getAllEvents() {
    return this.request(API_CONFIG.ENDPOINTS.EVENTS_ALL)
  }

  /**
   * Search Events with AI
   * POST /api/events/search
   * @param {string} query - Natural language search query
   */
  async searchEvents(query) {
    return this.request(API_CONFIG.ENDPOINTS.EVENTS_SEARCH, {
      method: 'POST',
      body: JSON.stringify({ query })
    })
  }

  /**
   * Get Event by ID
   * GET /api/events/:id
   * @param {string} eventId - Event ID
   */
  async getEventById(eventId) {
    return this.request(`${API_CONFIG.ENDPOINTS.EVENT_BY_ID}/${eventId}`)
  }

  /**
   * Send Chat Message
   * POST /api/chat
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages
   */
  async sendChatMessage(message, conversationHistory = []) {
    return this.request(API_CONFIG.ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory
      })
    })
  }

  /**
   * Parse User Preferences
   * POST /api/preferences/parse
   * @param {string} input - Natural language input
   */
  async parsePreferences(input) {
    return this.request(API_CONFIG.ENDPOINTS.PREFERENCES_PARSE, {
      method: 'POST',
      body: JSON.stringify({ input })
    })
  }
}

// Export singleton instance
export const apiService = new APIService()
export default apiService
