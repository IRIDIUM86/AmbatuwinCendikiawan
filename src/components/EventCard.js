import React, { useState } from 'react'
import { Star } from 'lucide-react'

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
 * - Bookmark/star icon for saving events
 * - Trending badge for popular events
 * - Compact PETRONAS-style design
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
  const [isBookmarked, setIsBookmarked] = useState(false)
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

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  // Check if event should show trending badge (you can customize this logic)
  const isTrending = event.is_featured || event.status === 'upcoming'

  return (
    <div
      onClick={() => onSelect(event)}
      className="rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md relative"
      style={{
        background: '#F5F3F0',
        border: '1px solid #E8E6E3'
      }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(event)
        }
      }}
      aria-label={`Event: ${event.event_name}`}
    >
      {/* Star/Bookmark Icon - Top Right */}
      <button
        onClick={handleBookmarkClick}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all z-10"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <Star
          size={18}
          className={isBookmarked ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-600'}
        />
      </button>

      {/* Event Name as Heading */}
      <h3
        className="text-base font-bold mb-2 pr-8 line-clamp-2"
        style={{
          color: '#2D2D2D',
          fontFamily: "'Inter', sans-serif",
          lineHeight: '1.3'
        }}
      >
        {event.event_name}
      </h3>

      {/* Event Location (City, State) */}
      {event.city && event.state && (
        <p
          className="text-sm mb-1 text-gray-600"
        >
          {event.city}, {event.state}
        </p>
      )}

      {/* Posting Date / Event Date */}
      {event.event_date && (
        <p
          className="text-xs mb-3"
          style={{ color: '#666' }}
        >
          • Posting Date {formatDate(event.event_date)}
        </p>
      )}

      {/* Trending Badge */}
      {isTrending && (
        <div className="mb-3">
          <span
            className="text-xs px-2 py-1 rounded font-semibold inline-flex items-center gap-1"
            style={{
              color: '#00A9A5',
              backgroundColor: 'transparent'
            }}
          >
            ↗ TRENDING
          </span>
        </div>
      )}

      {/* Event Description Preview */}
      <p
        className="text-sm mb-3 line-clamp-3"
        style={{
          color: '#4A4A4A',
          lineHeight: '1.5'
        }}
      >
        {event.description || 'Join us for an exciting event. Click to learn more about this opportunity and how you can participate as a vendor.'}
      </p>

      {/* Event Type Badge at Bottom */}
      {event.event_type && (
        <div className="pt-2 border-t" style={{ borderColor: '#E8E6E3' }}>
          <span
            className="text-xs font-medium"
            style={{ color: '#666' }}
          >
            {event.event_type}
          </span>
        </div>
      )}
    </div>
  )
}
