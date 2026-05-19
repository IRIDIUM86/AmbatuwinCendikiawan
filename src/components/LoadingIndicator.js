import React from 'react'

/**
 * LoadingIndicator Component
 * 
 * Displays a visual loading indicator with spinner animation and loading message.
 * Used during async operations like fetching events or processing AI responses.
 * 
 * Props:
 *   - message: Optional custom loading message (default: "Loading...")
 * 
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 */
export default function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-12 px-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner Animation */}
      <div className="mb-4" aria-hidden="true">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
      </div>

      {/* Loading Message */}
      <p className="text-gray-400 text-base font-medium">{message}</p>
    </div>
  )
}
