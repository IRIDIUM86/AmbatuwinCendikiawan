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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button (X icon) */}
        <button
          onClick={onClose}
          className="float-right text-gray-600 hover:text-gray-900 transition-colors p-1"
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
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {/* Event Name */}
        <h2 
          id="modal-title"
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {event.event_name}
        </h2>

        {/* Event Type Badge */}
        {event.event_type && (
          <div className="mb-3">
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              {event.event_type}
            </span>
          </div>
        )}

        {/* Event Description */}
        {event.description && (
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">
            {event.description}
          </p>
        )}

        {/* Date & Time and Location */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Date & Time Section */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Date & Time</p>
            {event.event_date && (
              <p className="text-gray-600 text-sm">
                {formatDate(event.event_date)}
              </p>
            )}
            {event.start_time && event.end_time && (
              <p className="text-gray-600 text-sm">
                {event.start_time} - {event.end_time}
              </p>
            )}
          </div>

          {/* Location Section */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Location</p>
            {event.venue_name && (
              <p className="text-gray-600 text-sm">{event.venue_name}</p>
            )}
            {event.city && event.state && (
              <p className="text-gray-600 text-sm">
                {event.city}, {event.state}
              </p>
            )}
          </div>
        </div>

        {/* Target Industries */}
        {event.target_industries && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-1">Target Industries</p>
            <p className="text-gray-600 text-sm">{event.target_industries}</p>
          </div>
        )}

        {/* Target Audience */}
        {event.target_audience && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-1">Target Audience</p>
            <p className="text-gray-600 text-sm">{event.target_audience}</p>
          </div>
        )}

        {/* Expected Footfall */}
        {event.expected_footfall !== undefined && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-1">Expected Footfall</p>
            <p className="text-gray-600 text-sm">
              {formatFootfall(event.expected_footfall)}
            </p>
          </div>
        )}

        {/* Error Message Display */}
        {applicationError && (
          <div 
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4"
            role="alert"
          >
            <p className="text-sm">{applicationError}</p>
          </div>
        )}

        {/* Apply as Vendor Button */}
        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          aria-label={applying ? 'Applying as vendor...' : 'Apply as vendor'}
        >
          {applying ? 'Applying...' : 'Apply as Vendor'}
        </button>
      </div>
    </div>
  )
}
