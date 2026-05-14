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
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-md p-4">
      {/* Filter Controls Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Event Type Filter Dropdown */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Filter by event type"
        >
          <option value="">All Types</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Location Filter Dropdown */}
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
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

      {/* Clear Filters Button - Only show when filters are active */}
      {(filters.type || filters.location) && (
        <button
          onClick={onClearFilters}
          className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
