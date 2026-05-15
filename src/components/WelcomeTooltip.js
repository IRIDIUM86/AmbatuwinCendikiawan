import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * WelcomeTooltip Component
 * 
 * Shows a dismissible welcome message for first-time users.
 * Uses localStorage to track if user has seen it.
 * 
 * Props:
 * - storageKey: Unique key for localStorage (default: 'welcome-tooltip-seen')
 * - title: Tooltip title
 * - message: Tooltip message
 * - position: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
 */
export default function WelcomeTooltip({ 
  storageKey = 'welcome-tooltip-seen',
  title = 'Welcome!',
  message = 'Get started by exploring the features.',
  position = 'bottom'
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen this tooltip before
    const hasSeenTooltip = localStorage.getItem(storageKey)
    if (!hasSeenTooltip) {
      // Show tooltip after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(storageKey, 'true')
  }

  if (!isVisible) return null

  const positionStyles = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <div 
      className={`absolute ${positionStyles[position]} z-50 w-80 rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300`}
      style={{
        background: 'oklch(99% 0.005 85)',
        border: '2px solid oklch(45% 0.15 25)',
        boxShadow: '0 4px 16px oklch(45% 0.15 25 / 0.2)'
      }}
      role="tooltip"
      aria-live="polite"
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg transition-colors duration-200"
        style={{ color: 'oklch(65% 0.01 15)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'oklch(96% 0.008 85)'
          e.currentTarget.style.color = 'oklch(25% 0.015 15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'oklch(65% 0.01 15)'
        }}
        aria-label="Dismiss tooltip"
      >
        <X size={16} />
      </button>

      {/* Title */}
      <h3 
        className="text-base font-bold mb-2 pr-6"
        style={{ 
          color: 'oklch(25% 0.015 15)',
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h3>

      {/* Message */}
      <p 
        className="text-sm font-medium leading-relaxed"
        style={{ 
          color: 'oklch(45% 0.02 15)',
          letterSpacing: '-0.01em'
        }}
      >
        {message}
      </p>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="mt-3 text-sm font-bold transition-colors duration-200"
        style={{ color: 'oklch(45% 0.15 25)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'oklch(35% 0.12 15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'oklch(45% 0.15 25)'
        }}
      >
        Got it
      </button>

      {/* Arrow indicator */}
      <div 
        className={`absolute w-3 h-3 rotate-45 ${
          position === 'bottom' ? '-top-1.5 left-6' :
          position === 'top' ? '-bottom-1.5 left-6' :
          position === 'right' ? '-left-1.5 top-6' :
          '-right-1.5 top-6'
        }`}
        style={{
          background: 'oklch(99% 0.005 85)',
          border: '2px solid oklch(45% 0.15 25)',
          borderRight: 'none',
          borderBottom: 'none'
        }}
      />
    </div>
  )
}
