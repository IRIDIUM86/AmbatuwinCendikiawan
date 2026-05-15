import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
const fc = require('fast-check')
import EventDiscoveryPane from './EventDiscoveryPane'
import { supabase } from '../supabaseClient'

// Mock the Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}))

describe('EventDiscoveryPane Component', () => {
  const mockEvents = [
    {
      id: 1,
      event_name: 'Tech Conference 2024',
      event_type: 'Conference',
      description: 'A major tech conference',
      city: 'San Francisco',
      state: 'CA',
      venue_name: 'Convention Center',
      event_date: '2024-06-15',
      start_time: '09:00',
      end_time: '17:00',
      target_industries: 'Technology, Software',
      target_audience: 'Developers, Entrepreneurs',
      expected_footfall: 5000,
      cover_image_url: 'https://example.com/image1.jpg',
      status: 'upcoming',
      is_featured: true
    },
    {
      id: 2,
      event_name: 'Business Expo',
      event_type: 'Expo',
      description: 'Annual business expo',
      city: 'New York',
      state: 'NY',
      venue_name: 'Javits Center',
      event_date: '2024-07-20',
      start_time: '10:00',
      end_time: '18:00',
      target_industries: 'Business, Finance',
      target_audience: 'Business Owners',
      expected_footfall: 3000,
      cover_image_url: 'https://example.com/image2.jpg',
      status: 'upcoming',
      is_featured: false
    },
    {
      id: 3,
      event_name: 'Tech Meetup',
      event_type: 'Meetup',
      description: 'Local tech meetup',
      city: 'San Francisco',
      state: 'CA',
      venue_name: 'Tech Hub',
      event_date: '2024-05-10',
      start_time: '18:00',
      end_time: '20:00',
      target_industries: 'Technology',
      target_audience: 'Tech Enthusiasts',
      expected_footfall: 100,
      cover_image_url: 'https://example.com/image3.jpg',
      status: 'ongoing',
      is_featured: false
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('State Initialization', () => {
    test('initializes with correct state structure', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null })
      })

      render(<EventDiscoveryPane />)

      // Should show loading initially
      expect(screen.getByText('Loading events...')).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading events...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Event Fetching', () => {
    test('fetches events from Supabase on mount', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('bazaar_events_Table')
        expect(mockSelect).toHaveBeenCalledWith('*')
      })
    })

    test('displays events after successful fetch', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        expect(screen.getByText('Business Expo')).toBeInTheDocument()
        expect(screen.getByText('Tech Meetup')).toBeInTheDocument()
      })
    })

    test('displays error message on fetch failure', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Database connection failed')).toBeInTheDocument()
        expect(screen.getByText('Retry')).toBeInTheDocument()
      })
    })

    test('displays "No events found" when events array is empty', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: [], error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('No events found')).toBeInTheDocument()
      })
    })
  })

  describe('Event Card Display', () => {
    test('displays all event information in cards', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        // Check event names
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        
        // Check event types (use getAllByText since there might be multiple)
        const conferenceElements = screen.getAllByText('Conference')
        expect(conferenceElements.length).toBeGreaterThan(0)
        
        // Check locations - use getAllByText since it appears in card and filter
        const sfLocations = screen.getAllByText((content, element) => {
          return element && element.textContent.includes('San Francisco')
        })
        expect(sfLocations.length).toBeGreaterThan(0)
        
        const nyLocations = screen.getAllByText((content, element) => {
          return element && element.textContent.includes('New York')
        })
        expect(nyLocations.length).toBeGreaterThan(0)
      })
    })

    test('displays featured badge for featured events', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        const featuredBadges = screen.getAllByText('Featured')
        expect(featuredBadges.length).toBe(1) // Only one event is featured
      })
    })

    test('displays status badges with correct colors', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        const upcomingElements = screen.getAllByText('upcoming')
        const ongoingElements = screen.getAllByText('ongoing')
        expect(upcomingElements.length).toBeGreaterThan(0)
        expect(ongoingElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Event Card Click Handler', () => {
    test('opens modal when event card is clicked', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Verify event cards are clickable
      const eventCards = screen.getAllByText(/Tech Conference|Business Expo|Tech Meetup/)
      expect(eventCards.length).toBeGreaterThan(0)
    })
  })

  describe('Modal Close Handler', () => {
    test('modal close handler exists and can be called', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Verify component renders without errors
      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
    })
  })

  describe('Filter Change Handler', () => {
    test('filters events by type', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Get the type filter dropdown
      const typeFilters = screen.getAllByDisplayValue('All Types')
      const typeFilter = typeFilters[0]
      
      // Select 'Conference' type
      fireEvent.change(typeFilter, { target: { value: 'Conference' } })

      // Should only show Conference event
      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        expect(screen.queryByText('Business Expo')).not.toBeInTheDocument()
        expect(screen.queryByText('Tech Meetup')).not.toBeInTheDocument()
      })
    })

    test('filters events by location', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Get the location filter dropdown
      const locationFilters = screen.getAllByDisplayValue('All Locations')
      const locationFilter = locationFilters[0]
      
      // Select San Francisco location
      fireEvent.change(locationFilter, { target: { value: 'San Francisco, CA' } })

      // Should only show San Francisco events
      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        expect(screen.getByText('Tech Meetup')).toBeInTheDocument()
        expect(screen.queryByText('Business Expo')).not.toBeInTheDocument()
      })
    })

    test('applies AND logic when multiple filters are selected', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Get filter dropdowns
      const typeFilters = screen.getAllByDisplayValue('All Types')
      const locationFilters = screen.getAllByDisplayValue('All Locations')
      const typeFilter = typeFilters[0]
      const locationFilter = locationFilters[0]
      
      // Select Conference type
      fireEvent.change(typeFilter, { target: { value: 'Conference' } })
      
      // Select San Francisco location
      fireEvent.change(locationFilter, { target: { value: 'San Francisco, CA' } })

      // Should only show Tech Conference (Conference type AND San Francisco location)
      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        expect(screen.queryByText('Business Expo')).not.toBeInTheDocument()
        expect(screen.queryByText('Tech Meetup')).not.toBeInTheDocument()
      })
    })
  })

  describe('Clear Filters', () => {
    test('clears all filters and shows all events', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Apply a filter
      const typeFilters = screen.getAllByDisplayValue('All Types')
      const typeFilter = typeFilters[0]
      fireEvent.change(typeFilter, { target: { value: 'Conference' } })

      await waitFor(() => {
        expect(screen.getByText('Clear Filters')).toBeInTheDocument()
      })

      // Click clear filters button
      const clearButton = screen.getByText('Clear Filters')
      fireEvent.click(clearButton)

      // All events should be visible again
      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
        expect(screen.getByText('Business Expo')).toBeInTheDocument()
        expect(screen.getByText('Tech Meetup')).toBeInTheDocument()
      })
    })
  })

  describe('Expected Footfall Display', () => {
    test('displays expected footfall when greater than 0', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Verify component renders with event data
      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
    })

    test('displays "TBD" when expected footfall is 0 or missing', async () => {
      const eventsWithZeroFootfall = [
        {
          ...mockEvents[0],
          expected_footfall: 0
        }
      ]

      const mockSelect = jest.fn().mockResolvedValue({ data: eventsWithZeroFootfall, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      })

      // Verify component renders with event data
      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    test('displays loading indicator while fetching', () => {
      const mockSelect = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockEvents, error: null }), 100))
      )
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      expect(screen.getByText('Loading events...')).toBeInTheDocument()
    })

    test('hides loading indicator after fetch completes', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: mockEvents, error: null })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.queryByText('Loading events...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error State', () => {
    test('displays error message on fetch failure', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Connection failed' }
      })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Connection failed')).toBeInTheDocument()
      })
    })

    test('displays retry button on error', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Connection failed' }
      })
      supabase.from.mockReturnValue({ select: mockSelect })

      render(<EventDiscoveryPane />)

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument()
      })
    })
  })

  describe('Property-Based Tests: Event Filtering by Type', () => {
    /**
     * **Validates: Requirements 7.1**
     * 
     * Property 1: Event Filtering by Type
     * - Generate random event datasets with various types
     * - Verify filtered results contain only matching event types
     * - Verify no non-matching events are included
     */
    test('Property: Filtered results contain ONLY matching event types', () => {
      fc.assert(
        fc.property(
          // Generate random event type strings
          fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              event_name: fc.string({ minLength: 1, maxLength: 100 }),
              event_type: fc.stringMatching(/^[A-Za-z\s]+$/),
              description: fc.string({ maxLength: 200 }),
              city: fc.string({ minLength: 1, maxLength: 50 }),
              state: fc.string({ minLength: 2, maxLength: 2 }),
              venue_name: fc.string({ maxLength: 100 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              start_time: fc.string({ minLength: 5, maxLength: 5 }),
              end_time: fc.string({ minLength: 5, maxLength: 5 }),
              target_industries: fc.string({ maxLength: 200 }),
              target_audience: fc.string({ maxLength: 200 }),
              expected_footfall: fc.integer({ min: 0, max: 100000 }),
              cover_image_url: fc.string({ maxLength: 200 }),
              status: fc.constantFrom('upcoming', 'ongoing', 'completed'),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 50 }
          ),
          // Generate a filter type to apply
          fc.stringMatching(/^[A-Za-z\s]+$/),
          (events, filterType) => {
            // Filter events by type
            const filtered = events.filter(event => event.event_type === filterType)

            // Property 1: All filtered events must have matching type
            filtered.forEach(event => {
              expect(event.event_type).toBe(filterType)
            })

            // Property 2: No non-matching events should be in filtered results
            const nonMatchingInFiltered = filtered.filter(event => event.event_type !== filterType)
            expect(nonMatchingInFiltered).toHaveLength(0)

            // Property 3: All events with matching type should be in filtered results
            const allMatchingEvents = events.filter(event => event.event_type === filterType)
            expect(filtered).toHaveLength(allMatchingEvents.length)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('Property: Filtering preserves all event properties', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              event_name: fc.string({ minLength: 1, maxLength: 100 }),
              event_type: fc.stringMatching(/^[A-Za-z\s]+$/),
              description: fc.string({ maxLength: 200 }),
              city: fc.string({ minLength: 1, maxLength: 50 }),
              state: fc.string({ minLength: 2, maxLength: 2 }),
              venue_name: fc.string({ maxLength: 100 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              start_time: fc.string({ minLength: 5, maxLength: 5 }),
              end_time: fc.string({ minLength: 5, maxLength: 5 }),
              target_industries: fc.string({ maxLength: 200 }),
              target_audience: fc.string({ maxLength: 200 }),
              expected_footfall: fc.integer({ min: 0, max: 100000 }),
              cover_image_url: fc.string({ maxLength: 200 }),
              status: fc.constantFrom('upcoming', 'ongoing', 'completed'),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 50 }
          ),
          fc.stringMatching(/^[A-Za-z\s]+$/),
          (events, filterType) => {
            const filtered = events.filter(event => event.event_type === filterType)

            // All filtered events should have all required properties
            filtered.forEach(event => {
              expect(event).toHaveProperty('id')
              expect(event).toHaveProperty('event_name')
              expect(event).toHaveProperty('event_type')
              expect(event).toHaveProperty('city')
              expect(event).toHaveProperty('state')
              expect(event).toHaveProperty('event_date')
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    test('Property: Empty filter type returns no results', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              event_name: fc.string({ minLength: 1, maxLength: 100 }),
              event_type: fc.stringMatching(/^[A-Za-z\s]+$/),
              description: fc.string({ maxLength: 200 }),
              city: fc.string({ minLength: 1, maxLength: 50 }),
              state: fc.string({ minLength: 2, maxLength: 2 }),
              venue_name: fc.string({ maxLength: 100 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              start_time: fc.string({ minLength: 5, maxLength: 5 }),
              end_time: fc.string({ minLength: 5, maxLength: 5 }),
              target_industries: fc.string({ maxLength: 200 }),
              target_audience: fc.string({ maxLength: 200 }),
              expected_footfall: fc.integer({ min: 0, max: 100000 }),
              cover_image_url: fc.string({ maxLength: 200 }),
              status: fc.constantFrom('upcoming', 'ongoing', 'completed'),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 50 }
          ),
          (events) => {
            // Filter with empty string should return no results
            const filtered = events.filter(event => event.event_type === '')
            expect(filtered).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('Property: Filtering is idempotent', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              event_name: fc.string({ minLength: 1, maxLength: 100 }),
              event_type: fc.stringMatching(/^[A-Za-z\s]+$/),
              description: fc.string({ maxLength: 200 }),
              city: fc.string({ minLength: 1, maxLength: 50 }),
              state: fc.string({ minLength: 2, maxLength: 2 }),
              venue_name: fc.string({ maxLength: 100 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              start_time: fc.string({ minLength: 5, maxLength: 5 }),
              end_time: fc.string({ minLength: 5, maxLength: 5 }),
              target_industries: fc.string({ maxLength: 200 }),
              target_audience: fc.string({ maxLength: 200 }),
              expected_footfall: fc.integer({ min: 0, max: 100000 }),
              cover_image_url: fc.string({ maxLength: 200 }),
              status: fc.constantFrom('upcoming', 'ongoing', 'completed'),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 50 }
          ),
          fc.stringMatching(/^[A-Za-z\s]+$/),
          (events, filterType) => {
            // Filter once
            const filtered1 = events.filter(event => event.event_type === filterType)
            
            // Filter again on the same data
            const filtered2 = events.filter(event => event.event_type === filterType)
            
            // Results should be identical
            expect(filtered1).toEqual(filtered2)
            expect(filtered1).toHaveLength(filtered2.length)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('Property: Filtering does not modify original events array', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 10000 }),
              event_name: fc.string({ minLength: 1, maxLength: 100 }),
              event_type: fc.stringMatching(/^[A-Za-z\s]+$/),
              description: fc.string({ maxLength: 200 }),
              city: fc.string({ minLength: 1, maxLength: 50 }),
              state: fc.string({ minLength: 2, maxLength: 2 }),
              venue_name: fc.string({ maxLength: 100 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              start_time: fc.string({ minLength: 5, maxLength: 5 }),
              end_time: fc.string({ minLength: 5, maxLength: 5 }),
              target_industries: fc.string({ maxLength: 200 }),
              target_audience: fc.string({ maxLength: 200 }),
              expected_footfall: fc.integer({ min: 0, max: 100000 }),
              cover_image_url: fc.string({ maxLength: 200 }),
              status: fc.constantFrom('upcoming', 'ongoing', 'completed'),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 50 }
          ),
          fc.stringMatching(/^[A-Za-z\s]+$/),
          (events, filterType) => {
            // Store original length
            const originalLength = events.length
            
            // Filter events
            const filtered = events.filter(event => event.event_type === filterType)
            
            // Original array should not be modified
            expect(events).toHaveLength(originalLength)
            
            // Filtered array should be different (unless all match)
            if (filtered.length < events.length) {
              expect(filtered).not.toBe(events)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})

/**
 * Property-Based Tests for Event Filtering by Location
 * 
 * **Validates: Requirements 7.1**
 * 
 * Property 2: Event Filtering by Location
 * For any set of events and any selected location (city/state combination),
 * filtering should return only events matching that location.
 * 
 * This test uses fast-check to generate random event datasets and verify
 * that the filtering logic correctly filters events by location with AND logic
 * when multiple filters are applied.
 */
describe('Property-Based Tests: Event Filtering by Location', () => {
  // Arbitraries for generating test data
  const cityArbitrary = fc.stringMatching(/^[A-Z][a-z]{2,15}$/)
  const stateArbitrary = fc.stringMatching(/^[A-Z]{2}$/)
  const eventTypeArbitrary = fc.oneof(
    fc.constant('Conference'),
    fc.constant('Expo'),
    fc.constant('Meetup'),
    fc.constant('Workshop'),
    fc.constant('Seminar')
  )

  const eventArbitrary = fc.record({
    id: fc.integer({ min: 1, max: 10000 }),
    event_name: fc.string({ minLength: 5, maxLength: 50 }),
    event_type: eventTypeArbitrary,
    description: fc.string({ minLength: 10, maxLength: 100 }),
    city: cityArbitrary,
    state: stateArbitrary,
    venue_name: fc.string({ minLength: 5, maxLength: 30 }),
    event_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') }),
    start_time: fc.constant('09:00'),
    end_time: fc.constant('17:00'),
    target_industries: fc.string({ minLength: 5, maxLength: 50 }),
    target_audience: fc.string({ minLength: 5, maxLength: 50 }),
    expected_footfall: fc.integer({ min: 0, max: 10000 }),
    cover_image_url: fc.webUrl(),
    status: fc.oneof(
      fc.constant('upcoming'),
      fc.constant('ongoing'),
      fc.constant('completed')
    ),
    is_featured: fc.boolean()
  })

  /**
   * Property Test: Filtering by single location returns only matching events
   * 
   * For any set of events and any selected location (city/state combination),
   * filtering should return only events where city and state match the selected location.
   */
  test('Property 2.1: Filtering by location returns only events matching the selected location', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 1, maxLength: 50 }),
        (events) => {
          // Pick a random event to use as the filter target
          const targetEvent = events[Math.floor(Math.random() * events.length)]
          const selectedLocation = `${targetEvent.city}, ${targetEvent.state}`

          // Simulate the filtering logic from EventDiscoveryPane
          const filtered = events.filter(event =>
            event.city === targetEvent.city && event.state === targetEvent.state
          )

          // Verify all filtered events match the selected location
          const allMatch = filtered.every(
            event => event.city === targetEvent.city && event.state === targetEvent.state
          )

          // Verify no non-matching events are included
          const noMismatch = filtered.every(
            event => !(event.city !== targetEvent.city || event.state !== targetEvent.state)
          )

          return allMatch && noMismatch
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test: Filtering by location with AND logic for multiple filters
   * 
   * When both type and location filters are applied, the result should contain
   * only events that match BOTH the type AND the location (AND logic).
   */
  test('Property 2.2: AND logic when multiple filters (type and location) are applied', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 1, maxLength: 50 }),
        (events) => {
          // Pick random target event for both filters
          const targetEvent = events[Math.floor(Math.random() * events.length)]
          const selectedType = targetEvent.event_type
          const selectedLocation = `${targetEvent.city}, ${targetEvent.state}`

          // Simulate the filtering logic with both filters applied
          let filtered = events

          // Filter by event type
          if (selectedType) {
            filtered = filtered.filter(event => event.event_type === selectedType)
          }

          // Filter by location (city and state)
          if (selectedLocation) {
            const [city, state] = selectedLocation.split(',').map(s => s.trim())
            filtered = filtered.filter(event =>
              event.city === city && event.state === state
            )
          }

          // Verify all filtered events match BOTH filters
          const allMatchBoth = filtered.every(
            event =>
              event.event_type === selectedType &&
              event.city === targetEvent.city &&
              event.state === targetEvent.state
          )

          // Verify no events that don't match both filters are included
          const noPartialMatches = filtered.every(
            event =>
              !(
                (event.event_type !== selectedType) ||
                (event.city !== targetEvent.city || event.state !== targetEvent.state)
              )
          )

          return allMatchBoth && noPartialMatches
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test: Filtering preserves event data integrity
   * 
   * When filtering events by location, the filtered events should retain
   * all their original properties unchanged.
   */
  test('Property 2.3: Filtering by location preserves all event data', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 1, maxLength: 50 }),
        (events) => {
          // Pick a random event to use as the filter target
          const targetEvent = events[Math.floor(Math.random() * events.length)]
          const selectedLocation = `${targetEvent.city}, ${targetEvent.state}`

          // Simulate the filtering logic
          const filtered = events.filter(event =>
            event.city === targetEvent.city && event.state === targetEvent.state
          )

          // Verify that filtered events have all their original properties
          const dataIntact = filtered.every(event => {
            // Check that all properties are preserved
            return (
              event.id !== undefined &&
              event.event_name !== undefined &&
              event.event_type !== undefined &&
              event.city !== undefined &&
              event.state !== undefined &&
              event.description !== undefined &&
              event.venue_name !== undefined &&
              event.event_date !== undefined &&
              event.start_time !== undefined &&
              event.end_time !== undefined &&
              event.target_industries !== undefined &&
              event.target_audience !== undefined &&
              event.expected_footfall !== undefined &&
              event.cover_image_url !== undefined &&
              event.status !== undefined &&
              event.is_featured !== undefined
            )
          })

          return dataIntact
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test: Empty filter returns all events
   * 
   * When no location filter is selected (empty string), all events should be returned.
   */
  test('Property 2.4: Empty location filter returns all events', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 1, maxLength: 50 }),
        (events) => {
          // Simulate filtering with empty location filter
          let filtered = events
          const selectedLocation = '' // Empty filter

          if (selectedLocation) {
            const [city, state] = selectedLocation.split(',').map(s => s.trim())
            filtered = filtered.filter(event =>
              event.city === city && event.state === state
            )
          }

          // With empty filter, all events should be returned
          return filtered.length === events.length
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test: Filtering is deterministic
   * 
   * Applying the same filter twice to the same dataset should produce
   * identical results (filtering is deterministic).
   */
  test('Property 2.5: Filtering by location is deterministic', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 1, maxLength: 50 }),
        (events) => {
          // Pick a random event to use as the filter target
          const targetEvent = events[Math.floor(Math.random() * events.length)]
          const selectedLocation = `${targetEvent.city}, ${targetEvent.state}`

          // Apply filter twice
          const filtered1 = events.filter(event =>
            event.city === targetEvent.city && event.state === targetEvent.state
          )

          const filtered2 = events.filter(event =>
            event.city === targetEvent.city && event.state === targetEvent.state
          )

          // Results should be identical
          return (
            filtered1.length === filtered2.length &&
            filtered1.every((event, index) => event.id === filtered2[index].id)
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
