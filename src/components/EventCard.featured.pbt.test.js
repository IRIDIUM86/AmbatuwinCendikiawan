import React from 'react'
import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

/**
 * Property-Based Tests for EventCard Featured Event Indicator Display
 * 
 * Task 5.3: Write property test for featured event indicator display
 * 
 * **Validates: Requirements 19.1**
 * 
 * This test file focuses specifically on the featured event indicator display
 * property, verifying that:
 * 1. When is_featured is true, a "Featured" badge appears
 * 2. When is_featured is false, no badge appears
 * 3. The badge has correct styling and accessibility attributes
 */

describe('EventCard Component - Featured Event Indicator Display (Task 5.3)', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Property 3: Featured Event Indicator Display
   * 
   * **Validates: Requirements 19.1**
   * 
   * Universal property:
   * When is_featured is true, a "Featured" badge appears on the event card.
   * When is_featured is false, no "Featured" badge appears on the event card.
   */
  describe('Property 3: Featured Event Indicator Display', () => {
    it('should display featured badge when is_featured is true', () => {
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
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.constant(true)
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // When is_featured is true, the "Featured" badge MUST appear
            const featuredBadge = screen.getByText('Featured')
            expect(featuredBadge).toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should not display featured badge when is_featured is false', () => {
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
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.constant(false)
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // When is_featured is false, the "Featured" badge MUST NOT appear
            const featuredBadge = screen.queryByText('Featured')
            expect(featuredBadge).not.toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display featured badge with correct styling when is_featured is true', () => {
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
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.constant(true)
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.getByText('Featured')

            // Featured badge must have correct styling classes
            expect(featuredBadge).toHaveClass('text-xs')
            expect(featuredBadge).toHaveClass('bg-blue-600')
            expect(featuredBadge).toHaveClass('text-white')
            expect(featuredBadge).toHaveClass('px-2')
            expect(featuredBadge).toHaveClass('py-1')
            expect(featuredBadge).toHaveClass('rounded')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should have proper accessibility label for featured badge when is_featured is true', () => {
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
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.constant(true)
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.getByLabelText('Featured event')

            // Featured badge must have proper accessibility label
            expect(featuredBadge).toBeInTheDocument()
            expect(featuredBadge).toHaveAttribute('aria-label', 'Featured event')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display featured badge alongside other badges when is_featured is true', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.oneof(
              fc.constant('Conference'),
              fc.constant('Workshop'),
              fc.constant('Seminar'),
              fc.constant('Networking')
            ),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.oneof(
              fc.constant(null),
              fc.webUrl()
            ),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.constant(true)
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Featured badge should appear alongside event type badge
            const featuredBadges = screen.getAllByText('Featured')
            const typeBadges = screen.getAllByText(event.event_type)

            // At least one featured badge should exist
            expect(featuredBadges.length).toBeGreaterThan(0)
            expect(typeBadges.length).toBeGreaterThan(0)

            // Both badges should be in the same container (flex gap-2)
            const badgeContainer = featuredBadges[0].parentElement
            expect(badgeContainer).toContainElement(typeBadges[0])

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should handle featured indicator correctly across all event statuses', () => {
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
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.queryByText('Featured')

            // Featured indicator should appear only when is_featured is true,
            // regardless of the event status
            if (event.is_featured === true) {
              expect(featuredBadge).toBeInTheDocument()
            } else {
              expect(featuredBadge).not.toBeInTheDocument()
            }

            unmount()
          }
        ),
        { numRuns: 20 }
      )
    })
  })
})
