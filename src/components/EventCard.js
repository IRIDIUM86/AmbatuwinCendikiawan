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
        return 'text-green-700 border border-green-300'
      case 'ongoing':
        return 'text-yellow-700 border border-yellow-300'
      case 'completed':
        return 'text-gray-600 border border-gray-300'
      default:
        return 'text-gray-600 border border-gray-300'
    }
  }

  return (
    <div
      onClick={() => onSelect(event)}
      className="rounded-xl p-5 sm:p-6 cursor-pointer transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: 'oklch(99% 0.005 85)',
        border: '1.5px solid oklch(90% 0.01 85)',
        boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06)',
        '--ring-color': 'oklch(45% 0.15 25)',
        '--ring-offset-color': 'oklch(97% 0.008 85)'
      }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(event)
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'oklch(45% 0.15 25)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px oklch(0% 0 0 / 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'oklch(90% 0.01 85)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px oklch(0% 0 0 / 0.06)'
      }}
      aria-label={`Event: ${event.event_name}`}
    >
      {/* Event Cover Image with Fallback Placeholder */}
      <div 
        className="w-full h-48 sm:h-56 rounded-lg mb-4 overflow-hidden"
        style={{ background: 'oklch(94% 0.008 85)' }}
      >
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
          className="w-full h-full flex items-center justify-center text-sm"
          style={{ 
            display: event.cover_image_url ? 'none' : 'flex',
            background: 'oklch(94% 0.008 85)',
            color: 'oklch(65% 0.01 15)'
          }}
        >
          <span>No Image</span>
        </div>
      </div>

      {/* Event Name as Heading */}
      <h3 
        className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 break-words"
        style={{ 
          color: 'oklch(25% 0.015 15)',
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          letterSpacing: '-0.02em'
        }}
      >
        {event.event_name}
      </h3>

      {/* Event Date (Formatted) */}
      {event.event_date && (
        <p 
          className="text-sm mb-2 font-medium"
          style={{ 
            color: 'oklch(45% 0.02 15)',
            letterSpacing: '-0.01em'
          }}
        >
          {formatDate(event.event_date)}
        </p>
      )}

      {/* Event Location (City, State) */}
      {event.city && event.state && (
        <p 
          className="text-sm mb-4 truncate font-medium" 
          style={{ 
            color: 'oklch(45% 0.02 15)',
            letterSpacing: '-0.01em'
          }}
          title={`${event.city}, ${event.state}`}
        >
          {event.city}, {event.state}
        </p>
      )}

      {/* Event Type Badge, Featured Indicator, and Status Badge */}
      <div className="flex gap-2.5 flex-wrap">
        {/* Event Type Badge - Larger touch target */}
        {event.event_type && (
          <span
            className="text-xs sm:text-sm px-3 py-1.5 rounded-lg font-semibold"
            style={{
              background: 'oklch(96% 0.008 85)',
              color: 'oklch(35% 0.02 15)',
              border: '1.5px solid oklch(88% 0.01 85)',
              letterSpacing: '-0.01em'
            }}
            aria-label={`Event type: ${event.event_type}`}
          >
            {event.event_type}
          </span>
        )}

        {/* Featured Indicator - Larger touch target */}
        {event.is_featured && (
          <span
            className="text-xs sm:text-sm px-3 py-1.5 rounded-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, oklch(45% 0.15 25) 0%, oklch(55% 0.18 35) 100%)',
              color: 'oklch(99% 0.005 85)',
              boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.2)',
              letterSpacing: '-0.01em'
            }}
            aria-label="Featured event"
          >
            Featured
          </span>
        )}

        {/* Status Badge (Color-Coded) - Larger touch target */}
        {event.status && (
          <span
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-semibold ${getStatusBadgeColor(event.status)}`}
            style={{ letterSpacing: '-0.01em' }}
            aria-label={`Event status: ${event.status}`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        )}
      </div>
    </div>
  )
}
