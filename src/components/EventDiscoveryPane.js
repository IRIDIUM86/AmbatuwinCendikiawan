import React, { useState, useEffect } from 'react'
import { fetchAllEventsWithRetry, getUniqueEventTypes, getUniqueLocations } from '../utils/supabaseQueries'
import apiService from '../services/apiService'
import API_CONFIG from '../config/api'
import EventCard from './EventCard'
import EventFilter from './EventFilter'
import EventDetailsModal from './EventDetailsModal'
import ErrorMessage from './ErrorMessage'
import LoadingIndicator from './LoadingIndicator'

/**
 * EventDiscoveryPane Component
 * 
 * Manages the left pane of the split-screen layout with:
 * - Event fetching from Supabase
 * - Event filtering by type and location
 * - Event card display
 * - Event details modal
 * - Loading and error states
 * 
 * State Management:
 * - events: Array of all events from Supabase
 * - filteredEvents: Array of events after applying filters
 * - selectedEvent: Currently selected event for modal display
 * - showModal: Boolean indicating if modal is open
 * - loading: Boolean indicating if events are being fetched
 * - error: Error message if fetch fails
 * - filters: Object containing active filters (type, location)
 * 
 * Requirements: 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8
 */
export default function EventDiscoveryPane() {
  // State for events data
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  // State for loading and error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    location: ''
  })

  /**
   * Fetch events from Supabase or Backend API on component mount
   * Uses retry mechanism to handle transient failures
   * Retrieves all required fields from bazaar_events table
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let data
        
        // Use backend API if configured, otherwise use direct Supabase
        if (API_CONFIG.USE_BACKEND) {
          console.log('Fetching events from backend API...')
          const response = await apiService.getAllEvents()
          
          if (!response.success) {
            throw new Error(response.error || 'Failed to fetch events from backend')
          }
          
          data = response.events || []
        } else {
          console.log('Fetching events directly from Supabase...')
          data = await fetchAllEventsWithRetry(3, 1000)
        }
        
        setEvents(data || [])
        setFilteredEvents(data || [])
        setFilteredEvents(data || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch events')
        setEvents([])
        setFilteredEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  /**
   * Apply filters to events whenever filters or events change
   * Implements AND logic for multiple filters
   */
  useEffect(() => {
    let filtered = events

    // Filter by event type
    if (filters.type) {
      filtered = filtered.filter(event => event.event_type === filters.type)
    }

    // Filter by location (city and state)
    if (filters.location) {
      const [city, state] = filters.location.split(',').map(s => s.trim())
      filtered = filtered.filter(event => 
        event.city === city && event.state === state
      )
    }

    setFilteredEvents(filtered)
  }, [filters, events])

  /**
   * Handle filter change
   * Updates the filters state which triggers re-filtering
   */
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  /**
   * Clear all filters
   * Resets filters to empty values, showing all events
   */
  const handleClearFilters = () => {
    setFilters({
      type: '',
      location: ''
    })
  }

  /**
   * Handle event card click
   * Opens modal with selected event details
   */
  const handleEventCardClick = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  /**
   * Handle modal close
   * Closes modal and clears selected event
   */
  const handleModalClose = () => {
    setShowModal(false)
    setSelectedEvent(null)
  }

  /**
   * Handle vendor application
   * Placeholder for vendor application logic
   */
  const handleApplyAsVendor = async (event) => {
    try {
      // TODO: Implement vendor application submission
      console.log('Applying as vendor for event:', event)
      // For now, just close the modal
      handleModalClose()
    } catch (err) {
      throw new Error('Failed to submit vendor application')
    }
  }

  /**
   * Handle retry button click
   * Re-triggers event fetch
   */
  const handleRetry = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data
      
      if (API_CONFIG.USE_BACKEND) {
        const response = await apiService.getAllEvents()
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch events from backend')
        }
        data = response.events || []
      } else {
        data = await fetchAllEventsWithRetry(3, 1000)
      }
      
      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (err) {
      console.error('Fetch events error:', err)
      setError(err.message || 'Failed to fetch events')
      setEvents([])
      setFilteredEvents([])
    } finally {
      setLoading(false)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        style={{ background: 'oklch(98% 0.006 85)' }}
      >
        <LoadingIndicator message="Finding events for you..." />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: 'oklch(98% 0.006 85)' }}
      >
        <div className="text-center max-w-md px-6">
          <h2 
            className="text-xl font-bold mb-3"
            style={{ 
              color: 'oklch(25% 0.015 15)',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              letterSpacing: '-0.02em'
            }}
          >
            Couldn't load events
          </h2>
          <p 
            className="text-base mb-6 font-medium"
            style={{ 
              color: 'oklch(45% 0.02 15)',
              letterSpacing: '-0.01em'
            }}
          >
            {error}. Check your connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl font-bold transition-all duration-200"
            style={{
              background: 'oklch(45% 0.15 25)',
              color: 'oklch(99% 0.005 85)',
              boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 16px oklch(45% 0.15 25 / 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.25)'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        background: '#FEFEFE',
        borderColor: '#E0E0E0'
      }}
    >
      {/* Header with Sort Options */}
      {filteredEvents.length > 0 && (
        <div
          className="border-b px-6 sm:px-8 py-3 flex justify-between items-center"
          style={{
            background: 'oklch(99% 0.005 85)',
            borderColor: 'oklch(90% 0.01 85)'
          }}
        >
          <span className="text-sm font-medium" style={{ color: 'oklch(45% 0.02 15)' }}>
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </span>
          <button
            className="text-sm font-semibold flex items-center gap-1 hover:underline"
            style={{ color: 'oklch(25% 0.015 15)' }}
          >
            Posting Date ↕
          </button>
        </div>
      )}

      {/* Event Cards Container - Scrollable */}
      <div
        className="flex-1 overflow-y-auto p-6 sm:p-8"
        role="region"
        aria-live="polite"
        aria-label="Event list"
      >
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 max-w-md mx-auto">
            <h2
              className="text-2xl font-bold mb-3"
              style={{
                color: 'oklch(25% 0.015 15)',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                letterSpacing: '-0.02em'
              }}
            >
              {filters.type || filters.location ? 'No events match your filters' : 'No events yet'}
            </h2>
            <p
              className="text-base mb-6 font-medium leading-relaxed"
              style={{
                color: 'oklch(45% 0.02 15)',
                letterSpacing: '-0.01em'
              }}
            >
              {filters.type || filters.location
                ? "Try different filters or ask the AI assistant to find events that match your specific needs."
                : "Events will appear here once added. Meanwhile, ask the AI assistant about vendor requirements or event planning tips."}
            </p>
            {(filters.type || filters.location) && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-200 mb-4"
                style={{
                  background: 'oklch(45% 0.15 25)',
                  color: 'oklch(99% 0.005 85)',
                  boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px oklch(45% 0.15 25 / 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.25)'
                }}
              >
                Clear All Filters
              </button>
            )}
            <p
              className="text-sm font-semibold"
              style={{
                color: 'oklch(65% 0.01 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Tip: Ask the AI to search by event type, location, or budget
            </p>
          </div>
        ) : (
          <>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={handleEventCardClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Event Filter Component - Sticky at Bottom */}
      <EventFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        eventTypes={getUniqueEventTypes(events)}
        locations={getUniqueLocations(events)}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={handleModalClose}
        onApply={handleApplyAsVendor}
      />
    </div>
  )
}
