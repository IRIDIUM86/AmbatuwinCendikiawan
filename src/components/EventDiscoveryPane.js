import React, { useState, useEffect } from 'react'
import { fetchAllEventsWithRetry, getUniqueEventTypes, getUniqueLocations } from '../utils/supabaseQueries'
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
   * Fetch events from Supabase on component mount
   * Uses retry mechanism to handle transient failures
   * Retrieves all required fields from bazaar_events_Table
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchAllEventsWithRetry(3, 1000)
        
        setEvents(data || [])
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
      
      const data = await fetchAllEventsWithRetry(3, 1000)
      
      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (err) {
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
      <div className="flex items-center justify-center h-full bg-gray-50">
        <LoadingIndicator message="Loading events..." />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <ErrorMessage message={error} />
          <button
            onClick={handleRetry}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Event Cards Container - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={handleEventCardClick}
              />
            ))}
          </div>
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
