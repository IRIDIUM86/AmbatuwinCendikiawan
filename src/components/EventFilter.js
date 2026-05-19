import React from 'react'

/**
 * EventFilter Component
 * 
 * Sticky filter controls positioned at the bottom of the Event Discovery Pane.
 * Provides dropdown filters for event type and location, with a clear filters button.
 * 
 * Props:
 * - filters: Object with 'type' and 'location' properties representing current filter values
 * - onFilterChange: Callback function(filterType, value) called when a filter changes
 * - onClearFilters: Callback function() called when clear filters button is clicked
 * - eventTypes: Array of unique event type strings for the type dropdown
 * - locations: Array of unique location strings (format: "city, state") for the location dropdown
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */
export default function EventFilter({
  filters = { type: '', location: '' },
  onFilterChange = () => {},
  onClearFilters = () => {},
  eventTypes = [],
  locations = []
}) {
  return (
    <div 
      className="sticky bottom-0 z-10 border-t p-5 sm:p-6"
      style={{
        background: 'oklch(99% 0.005 85)',
        borderColor: 'oklch(90% 0.01 85)'
      }}
    >
      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Event Type Filter Dropdown - Larger touch target */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-4 py-3 sm:py-2.5 rounded-xl text-sm font-semibold outline-none transition-all duration-200"
          style={{
            background: 'oklch(99% 0.005 85)',
            border: '2px solid oklch(88% 0.01 85)',
            color: 'oklch(25% 0.015 15)',
            letterSpacing: '-0.01em'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'oklch(45% 0.15 25)'
            e.target.style.boxShadow = '0 0 0 3px oklch(45% 0.15 25 / 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'oklch(88% 0.01 85)'
            e.target.style.boxShadow = 'none'
          }}
          aria-label="Filter by event type"
        >
          <option value="">All Event Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Location Filter Dropdown - Larger touch target */}
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="px-4 py-3 sm:py-2.5 rounded-xl text-sm font-semibold outline-none transition-all duration-200"
          style={{
            background: 'oklch(99% 0.005 85)',
            border: '2px solid oklch(88% 0.01 85)',
            color: 'oklch(25% 0.015 15)',
            letterSpacing: '-0.01em'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'oklch(45% 0.15 25)'
            e.target.style.boxShadow = '0 0 0 3px oklch(45% 0.15 25 / 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'oklch(88% 0.01 85)'
            e.target.style.boxShadow = 'none'
          }}
          aria-label="Filter by location"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button - Only show when filters are active - Larger touch target */}
      {(filters.type || filters.location) && (
        <button
          onClick={onClearFilters}
          className="w-full mt-3 px-4 py-3 sm:py-2.5 text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] outline-none"
          style={{
            color: 'oklch(45% 0.02 15)',
            border: '2px solid oklch(88% 0.01 85)',
            background: 'oklch(96% 0.008 85)',
            letterSpacing: '-0.01em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'oklch(45% 0.15 25)'
            e.currentTarget.style.color = 'oklch(99% 0.005 85)'
            e.currentTarget.style.borderColor = 'oklch(40% 0.14 20)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'oklch(96% 0.008 85)'
            e.currentTarget.style.color = 'oklch(45% 0.02 15)'
            e.currentTarget.style.borderColor = 'oklch(88% 0.01 85)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 3px oklch(45% 0.15 25 / 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none'
          }}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
