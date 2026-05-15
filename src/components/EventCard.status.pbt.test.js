import React from 'react'
import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

/**
 * Property-Based Tests for EventCard Status Display
 * 
 * **Validates: Requirements 20.1**
 * 
 * These tests verify universal properties that should hold
 * across all possible event status values and scenarios.
 */

describe('EventCard Component - Property 4: Event Status Display', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Property 4: Event Status Display
   * 
   * **Validates: Requirements 20.1**
   * 
   * Universal properties:
   * 1. When status is 'upcoming', the status badge displays "Upcoming" with green styling
   * 2. When status is 'ongoing', the status badge displays "Ongoing" with yellow styling
   * 3. When status is 'completed', the status badge displays "Completed" with gray styling
   * 4. The status badge is always displayed when status is provided
   * 5. The status badge uses correct color coding for each status value
   * 6. The status badge has proper accessibility label
   * 7. The status text is properly capitalized
   * 8. The status badge applies consistent styling (text-xs, px-2, py-1, rounded)
   */
  describe('Property 4: Event Status Display', () => {
    it('should display status badge with correct text for all status values', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
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
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Status badge should be displayed
            const statusText = event.status.charAt(0).toUpperCase() + event.status.slice(1)
            const statusBadge = screen.getByText(statusText)

            expect(statusBadge).toBeInTheDocument()
            expect(statusBadge).toHaveTextContent(statusText)

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display status badge with correct color for upcoming status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.oneof(
              fc.constant(null),
              fc.webUrl()
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const eventWithStatus = { ...event, status: 'upcoming' }
            const { unmount } = render(
              <EventCard event={eventWithStatus} onSelect={mockOnSelect} />
            )

            const statusBadge = screen.getByText('Upcoming')

            // Upcoming status should have green styling
            expect(statusBadge).toHaveClass('bg-green-100', 'text-green-600')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display status badge with correct color for ongoing status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.oneof(
              fc.constant(null),
              fc.webUrl()
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const eventWithStatus = { ...event, status: 'ongoing' }
            const { unmount } = render(
              <EventCard event={eventWithStatus} onSelect={mockOnSelect} />
            )

            const statusBadge = screen.getByText('Ongoing')

            // Ongoing status should have yellow styling
            expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-600')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display status badge with correct color for completed status', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.oneof(
              fc.constant(null),
              fc.webUrl()
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const eventWithStatus = { ...event, status: 'completed' }
            const { unmount } = render(
              <EventCard event={eventWithStatus} onSelect={mockOnSelect} />
            )

            const statusBadge = screen.getByText('Completed')

            // Completed status should have gray styling
            expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-600')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should apply consistent styling to status badge for all status values', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
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
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const statusText = event.status.charAt(0).toUpperCase() + event.status.slice(1)
            const statusBadge = screen.getByText(statusText)

            // All status badges should have consistent base styling
            expect(statusBadge).toHaveClass('text-xs')
            expect(statusBadge).toHaveClass('px-2')
            expect(statusBadge).toHaveClass('py-1')
            expect(statusBadge).toHaveClass('rounded')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should have proper accessibility label for status badge', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
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
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const statusBadge = screen.getByLabelText(`Event status: ${event.status}`)

            // Status badge should have proper accessibility label
            expect(statusBadge).toBeInTheDocument()
            expect(statusBadge).toHaveAttribute('aria-label', `Event status: ${event.status}`)

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display status badge alongside other badges', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
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

            // Status badge should appear alongside event type badge
            const statusBadges = container.querySelectorAll(`[aria-label="Event status: ${event.status}"]`)
            const typeBadges = container.querySelectorAll(`[aria-label*="Event type:"]`)

            expect(statusBadges.length).toBeGreaterThan(0)
            expect(typeBadges.length).toBeGreaterThan(0)

            // Both badges should be in the same container (flex gap-2)
            const statusBadge = statusBadges[0]
            const typeBadge = typeBadges[0]
            const badgeContainer = statusBadge.parentElement
            expect(badgeContainer).toContainElement(typeBadge)

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should maintain status badge visibility across different event types', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_name: fc.string({ minLength: 1 }),
              event_type: fc.oneof(
                fc.constant('Conference'),
                fc.constant('Workshop'),
                fc.constant('Seminar'),
                fc.constant('Networking'),
                fc.constant('Trade Show'),
                fc.constant('Expo')
              ),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              city: fc.string({ minLength: 1 }),
              state: fc.string({ minLength: 1, maxLength: 2 }),
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
            { minLength: 1, maxLength: 10 }
          ),
          (events) => {
            events.forEach(event => {
              const { unmount } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )

              // Status badge should appear for all event types
              const statusText = event.status.charAt(0).toUpperCase() + event.status.slice(1)
              const statusBadge = screen.getByText(statusText)
              expect(statusBadge).toBeInTheDocument()

              unmount()
            })
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should correctly capitalize status text for all status values', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
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
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const expectedText = event.status.charAt(0).toUpperCase() + event.status.slice(1)
            const statusBadge = screen.getByText(expectedText)

            // Status text should be properly capitalized
            expect(statusBadge).toHaveTextContent(expectedText)
            expect(statusBadge.textContent).toBe(expectedText)

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })
  })
})
