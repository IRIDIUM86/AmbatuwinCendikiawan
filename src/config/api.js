/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USE_BACKEND: USE_BACKEND_API,
  TIMEOUT: 30000, // 30 seconds
  
  ENDPOINTS: {
    // Health
    HEALTH: '/health',
    
    // Events
    EVENTS_ALL: '/events/all',
    EVENTS_SEARCH: '/events/search',
    EVENT_BY_ID: '/events',
    
    // Chat
    CHAT: '/chat',
    
    // Preferences
    PREFERENCES_PARSE: '/preferences/parse'
  }
}

export default API_CONFIG
