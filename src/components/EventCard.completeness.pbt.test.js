import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

/**
 * Property-Based Tests for EventCard Component - Information Completeness
 * 
 * **Validates: Requirements 4.1, 22.1, 23.1**
 * 
 * These tests verify that EventCard components display all required event
 * information fields correctly across all possible event data scenarios.
 * 
 * Requirements:
 * - 4.1: Event Card SHALL display event name, date, location, and type
 * - 22.1: Event Card SHALL display event type and location information
 * - 23.1: Event Card SHALL display event date and time information
 */

describe('EventCard Component - Property 6: Event Card Information Completeness', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Helper to generate valid event names (non-empty strings)
  const validEventName = () => fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)

  // Helper to generate valid city/state names
  const validLocationName = () => fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0)

  /**
   * Property: All required event fields are rendered in the event card
   * 
   * For any valid event object with required fields (event_name, event_type,
   * event_date, city, state), the EventCard should render all of these fields.
   */
  it('should render all required event fields for any valid event', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName(),
          cover_image_url: fc.oneof(
            fc.constant(null),
            fc.webUrl()
          ),
          is_featured: fc.boolean(),
          status: fc.oneof(
            fc.constant('upcoming'),
            fc.constant('ongoing'),
            fc.constant('completed')
          )
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          const card = container.querySelector('div[role="button"]')
          
          // Event name should always be rendered
          expect(card.textContent).toContain(event.event_name)

          // Event type badge should be rendered
          expect(card.textContent).toContain(event.event_type)

          // Event location should be rendered
          expect(card.textContent).toContain(`${event.city}, ${event.state}`)

          // Card should have proper structure
          expect(card).toBeInTheDocument()
          expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Event name is always displayed as a heading
   * 
   * For any event, the event_name should be rendered as an h3 heading
   * with proper styling classes.
   */
  it('should display event name as heading for all events', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName()
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          const heading = container.querySelector('h3')
          expect(heading).toBeInTheDocument()
          expect(heading.tagName).toBe('H3')
          expect(heading).toHaveClass('text-lg', 'font-bold', 'text-gray-900')
          expect(heading.textContent).toBe(event.event_name)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Event date is formatted and displayed when present
   * 
   * For any event with an event_date, the date should be formatted
   * as "MMM DD, YYYY" and displayed in the card.
   */
  it('should format and display event date when present', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName()
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          // Date should be formatted and displayed
          const dateString = event.event_date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
          const card = container.querySelector('div[role="button"]')
          expect(card.textContent).toContain(dateString)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Event location (city, state) is displayed when present
   * 
   * For any event with city and state, the location should be displayed
   * in the format "City, State" with proper styling.
   */
  it('should display event location (city, state) when present', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName()
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          const card = container.querySelector('div[role="button"]')
          const locationText = `${event.city}, ${event.state}`
          expect(card.textContent).toContain(locationText)

          // Verify it has correct styling
          const locationElements = card.querySelectorAll('p.text-sm.text-gray-600')
          let found = false
          locationElements.forEach(el => {
            if (el.textContent.includes(locationText)) {
              found = true
            }
          })
          expect(found).toBe(true)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Event type badge is displayed when present
   * 
   * For any event with an event_type, a badge should be displayed
   * with the event type text and proper styling.
   */
  it('should display event type badge when present', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName()
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          const card = container.querySelector('div[role="button"]')
          const typeBadge = card.querySelector('span[aria-label*="Event type"]')
          expect(typeBadge).toBeInTheDocument()
          expect(typeBadge).toHaveClass('text-xs', 'bg-blue-100', 'text-blue-600')
          expect(typeBadge.textContent).toBe(event.event_type)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Card renders without errors for any valid event object
   * 
   * For any event object (with or without optional fields), the component
   * should render without throwing errors.
   */
  it('should render without errors for any valid event object', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.oneof(
            fc.constant(null),
            fc.date()
          ),
          city: fc.oneof(
            fc.constant(null),
            validLocationName()
          ),
          state: fc.oneof(
            fc.constant(null),
            validLocationName()
          ),
          cover_image_url: fc.oneof(
            fc.constant(null),
            fc.webUrl()
          ),
          is_featured: fc.boolean(),
          status: fc.oneof(
            fc.constant(null),
            fc.constant('upcoming'),
            fc.constant('ongoing'),
            fc.constant('completed')
          )
        }),
        (event) => {
          const localMockOnSelect = jest.fn()
          // Should not throw any errors
          expect(() => {
            render(<EventCard event={event} onSelect={localMockOnSelect} />)
          }).not.toThrow()

          // Card should be rendered
          const cards = screen.getAllByRole('button')
          expect(cards.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Card maintains all event data integrity during rendering
   * 
   * When the card is clicked, the onSelect callback should receive
   * the exact same event object that was passed as a prop.
   */
  it('should maintain event data integrity during rendering', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName(),
          description: fc.string(),
          venue_name: fc.string(),
          target_industries: fc.string(),
          expected_footfall: fc.integer({ min: 0 })
        }),
        (event) => {
          const localMockOnSelect = jest.fn()
          const { unmount, container } = render(
            <EventCard event={event} onSelect={localMockOnSelect} />
          )

          // Click the card and verify the callback receives the original event
          const card = container.querySelector('div[role="button"]')
          fireEvent.click(card)

          expect(localMockOnSelect).toHaveBeenCalledWith(event)
          expect(localMockOnSelect).toHaveBeenCalledTimes(1)

          // Verify the callback received the exact same object
          const callArgument = localMockOnSelect.mock.calls[0][0]
          expect(callArgument).toEqual(event)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: All required fields are displayed regardless of optional fields
   * 
   * Even when optional fields are missing, all required fields
   * (event_name, event_type, event_date, city, state) should still be displayed.
   */
  it('should display all required fields regardless of optional fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName(),
          // Optional fields
          cover_image_url: fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.webUrl()
          ),
          is_featured: fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.boolean()
          ),
          status: fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.constant('upcoming')
          ),
          description: fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.string()
          ),
          venue_name: fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.string()
          )
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          // All required fields should be displayed
          const card = container.querySelector('div[role="button"]')
          expect(card).toBeInTheDocument()
          expect(card.textContent).toContain(event.event_name)
          expect(card.textContent).toContain(event.event_type)
          expect(card.textContent).toContain(`${event.city}, ${event.state}`)

          // Date should be formatted and displayed
          const dateString = event.event_date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
          expect(card.textContent).toContain(dateString)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property: Event information is displayed with correct styling
   * 
   * All event information should be displayed with the correct
   * premium light mode styling classes.
   */
  it('should display event information with correct styling', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer(),
          event_name: validEventName(),
          event_type: validEventName(),
          event_date: fc.date(),
          city: validLocationName(),
          state: validLocationName()
        }),
        (event) => {
          const { unmount, container } = render(
            <EventCard event={event} onSelect={mockOnSelect} />
          )

          const card = container.querySelector('div[role="button"]')
          
          // Event name should have correct styling
          const heading = card.querySelector('h3')
          expect(heading).toHaveClass('text-lg', 'font-bold', 'text-gray-900')
          expect(heading.textContent).toBe(event.event_name)

          // Event date should have correct styling
          const dateString = event.event_date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
          const dateElements = card.querySelectorAll('p.text-sm.text-gray-600')
          let dateFound = false
          dateElements.forEach(el => {
            if (el.textContent === dateString) {
              dateFound = true
            }
          })
          expect(dateFound).toBe(true)

          // Event location should have correct styling
          let locationFound = false
          dateElements.forEach(el => {
            if (el.textContent.includes(`${event.city}, ${event.state}`)) {
              locationFound = true
            }
          })
          expect(locationFound).toBe(true)

          // Event type badge should have correct styling
          const typeBadge = card.querySelector('span[aria-label*="Event type"]')
          expect(typeBadge).toHaveClass('text-xs', 'bg-blue-100', 'text-blue-600')
          expect(typeBadge.textContent).toBe(event.event_type)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })
})
