import React from 'react'

/**
 * EventCard Component
 * 
 * Displays a summary card for an event with:
 * - Event cover image (with fallback placeholder)
 * - Event name as heading (text-gray-900)
 * - Event date (formatted)
 * - Event location (city, state)
 * - Event type badge
 * - Featured indicator if is_featured is true
 * - Status badge (color-coded by status)
 * - Premium light mode styling (light background, shadow-md, rounded-xl)
 * - Click handler to trigger onSelect callback
 * 
 * Props:
 * - event: Event object with all required fields
 * - onSelect: Callback function when card is clicked
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 19.1, 20.1, 21.1, 22.1, 23.1
 */
export default function EventCard({ event, onSelect }) {
  if (!event) {
    return null
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (err) {
      return dateString
    }
  }

  // Get status badge color based on status value
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-600'
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-600'
      case 'completed':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(event)
        }
      }}
      aria-label={`Event: ${event.event_name}`}
    >
      {/* Event Cover Image with Fallback Placeholder */}
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.event_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500"
          style={{ display: event.cover_image_url ? 'none' : 'flex' }}
        >
          <span className="text-sm">No Image</span>
        </div>
      </div>

      {/* Event Name as Heading */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {event.event_name}
      </h3>

      {/* Event Date (Formatted) */}
      {event.event_date && (
        <p className="text-sm text-gray-600 mb-2">
          {formatDate(event.event_date)}
        </p>
      )}

      {/* Event Location (City, State) */}
      {event.city && event.state && (
        <p className="text-sm text-gray-600 mb-3">
          {event.city}, {event.state}
        </p>
      )}

      {/* Event Type Badge, Featured Indicator, and Status Badge */}
      <div className="flex gap-2 flex-wrap">
        {/* Event Type Badge */}
        {event.event_type && (
          <span
            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
            aria-label={`Event type: ${event.event_type}`}
          >
            {event.event_type}
          </span>
        )}

        {/* Featured Indicator */}
        {event.is_featured && (
          <span
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
            aria-label="Featured event"
          >
            Featured
          </span>
        )}

        {/* Status Badge (Color-Coded) */}
        {event.status && (
          <span
            className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(event.status)}`}
            aria-label={`Event status: ${event.status}`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  )
}
