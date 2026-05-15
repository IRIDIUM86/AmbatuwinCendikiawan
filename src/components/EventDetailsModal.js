import React, { useState } from 'react'
import { X } from 'lucide-react'

/**
 * EventDetailsModal Component
 * 
 * Displays complete event information in a modal dialog with:
 * - Event cover image
 * - Event name, description, date/time, location, venue
 * - Event type, target industries, target audience, expected footfall
 * - Apply as Vendor button with submission handler
 * - Close button (X icon)
 * - Premium light mode styling (light background, shadow-md, rounded-xl)
 * - Error message display if application fails
 * - Modal stays open to show error details
 * 
 * Props:
 * - event: Event object with all required fields
 * - isOpen: Boolean indicating if modal is visible
 * - onClose: Callback function when modal closes
 * - onApply: Callback function when Apply button clicked (async)
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 16.1, 24.1, 25.1, 26.1, 27.1
 */
export default function EventDetailsModal({ event, isOpen, onClose, onApply }) {
  const [applying, setApplying] = useState(false)
  const [applicationError, setApplicationError] = useState(null)

  if (!isOpen || !event) {
    return null
  }

  /**
   * Handle Apply as Vendor button click
   * Calls onApply callback and handles errors
   * Keeps modal open to display error details
   */
  const handleApply = async () => {
    setApplying(true)
    setApplicationError(null)
    
    try {
      await onApply(event)
    } catch (err) {
      // Keep modal open and display error message
      setApplicationError(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  /**
   * Format date for display
   */
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

  /**
   * Format expected footfall for display
   * Shows 'TBD' if zero or missing
   */
  const formatFootfall = (footfall) => {
    if (!footfall || footfall === 0) {
      return 'TBD'
    }
    return footfall.toString()
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'oklch(0% 0 0 / 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div 
        className="rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'oklch(99% 0.005 85)',
          border: '1.5px solid oklch(90% 0.01 85)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (X icon) */}
        <button
          onClick={onClose}
          className="float-right p-2 rounded-lg transition-all duration-200"
          style={{ color: 'oklch(65% 0.01 15)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'oklch(96% 0.008 85)'
            e.currentTarget.style.color = 'oklch(25% 0.015 15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'oklch(65% 0.01 15)'
          }}
          aria-label="Close modal"
          title="Close"
        >
          <X size={24} />
        </button>

        {/* Event Cover Image */}
        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt={event.event_name}
            className="w-full h-56 object-cover rounded-lg mb-6"
            style={{ background: 'oklch(94% 0.008 85)' }}
          />
        )}

        {/* Event Name */}
        <h2 
          id="modal-title"
          className="text-2xl sm:text-3xl font-bold mb-3 pr-10"
          style={{ 
            color: 'oklch(25% 0.015 15)',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          {event.event_name}
        </h2>

        {/* Event Type Badge */}
        {event.event_type && (
          <div className="mb-4">
            <span 
              className="text-sm px-3 py-1.5 rounded-lg font-semibold"
              style={{
                background: 'oklch(96% 0.008 85)',
                color: 'oklch(35% 0.02 15)',
                border: '1.5px solid oklch(88% 0.01 85)',
                letterSpacing: '-0.01em'
              }}
            >
              {event.event_type}
            </span>
          </div>
        )}

        {/* Event Description */}
        {event.description && (
          <p 
            className="mb-6 whitespace-pre-wrap font-medium leading-relaxed"
            style={{ 
              color: 'oklch(45% 0.02 15)',
              letterSpacing: '-0.01em'
            }}
          >
            {event.description}
          </p>
        )}

        {/* Date & Time and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Date & Time Section */}
          <div>
            <p 
              className="text-sm font-bold mb-2"
              style={{ 
                color: 'oklch(25% 0.015 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Date & Time
            </p>
            {event.event_date && (
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: 'oklch(45% 0.02 15)' }}
              >
                {formatDate(event.event_date)}
              </p>
            )}
            {event.start_time && event.end_time && (
              <p 
                className="text-sm font-medium"
                style={{ color: 'oklch(45% 0.02 15)' }}
              >
                {event.start_time} - {event.end_time}
              </p>
            )}
          </div>

          {/* Location Section */}
          <div>
            <p 
              className="text-sm font-bold mb-2"
              style={{ 
                color: 'oklch(25% 0.015 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Location
            </p>
            {event.venue_name && (
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: 'oklch(45% 0.02 15)' }}
              >
                {event.venue_name}
              </p>
            )}
            {event.city && event.state && (
              <p 
                className="text-sm font-medium"
                style={{ color: 'oklch(45% 0.02 15)' }}
              >
                {event.city}, {event.state}
              </p>
            )}
          </div>
        </div>

        {/* Target Industries */}
        {event.target_industries && (
          <div className="mb-6">
            <p 
              className="text-sm font-bold mb-2"
              style={{ 
                color: 'oklch(25% 0.015 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Target Industries
            </p>
            <p 
              className="text-sm font-medium"
              style={{ color: 'oklch(45% 0.02 15)' }}
            >
              {event.target_industries}
            </p>
          </div>
        )}

        {/* Target Audience */}
        {event.target_audience && (
          <div className="mb-6">
            <p 
              className="text-sm font-bold mb-2"
              style={{ 
                color: 'oklch(25% 0.015 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Target Audience
            </p>
            <p 
              className="text-sm font-medium"
              style={{ color: 'oklch(45% 0.02 15)' }}
            >
              {event.target_audience}
            </p>
          </div>
        )}

        {/* Expected Footfall */}
        {event.expected_footfall !== undefined && (
          <div className="mb-6">
            <p 
              className="text-sm font-bold mb-2"
              style={{ 
                color: 'oklch(25% 0.015 15)',
                letterSpacing: '-0.01em'
              }}
            >
              Expected Footfall
            </p>
            <p 
              className="text-sm font-medium"
              style={{ color: 'oklch(45% 0.02 15)' }}
            >
              {formatFootfall(event.expected_footfall)}
            </p>
          </div>
        )}

        {/* Error Message Display */}
        {applicationError && (
          <div 
            className="px-4 py-3 rounded-xl mb-6 font-semibold text-sm"
            style={{
              background: 'oklch(95% 0.05 25)',
              color: 'oklch(35% 0.08 25)',
              border: '1.5px solid oklch(85% 0.06 25)',
              letterSpacing: '-0.01em'
            }}
            role="alert"
          >
            {applicationError}
          </div>
        )}

        {/* Apply as Vendor Button */}
        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full py-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'oklch(45% 0.15 25)',
            color: 'oklch(99% 0.005 85)',
            boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)',
            letterSpacing: '-0.01em'
          }}
          onMouseEnter={(e) => {
            if (!applying) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 16px oklch(45% 0.15 25 / 0.35)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.25)'
          }}
          aria-label={applying ? 'Applying as vendor...' : 'Apply as vendor'}
        >
          {applying ? 'Applying...' : 'Apply as Vendor'}
        </button>
      </div>
    </div>
  )
}
