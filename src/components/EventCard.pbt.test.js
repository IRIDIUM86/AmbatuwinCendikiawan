import React from 'react'
import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

/**
 * Property-Based Tests for EventCard Component
 * 
 * These tests verify universal properties that should hold
 * across all possible inputs, not just specific examples.
 */

describe('EventCard Component - Property-Based Tests', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Property 3: Featured Event Indicator Display
   * 
   * **Validates: Requirements 19.1**
   * 
   * Universal properties:
   * 1. When is_featured is true, the featured indicator appears on the card
   * 2. When is_featured is false, the featured indicator does NOT appear on the card
   * 3. When is_featured is undefined/null, the featured indicator does NOT appear on the card
   * 4. The featured indicator uses the correct styling (bg-blue-600, text-white)
   * 5. The featured indicator displays the text "Featured"
   * 6. The featured indicator has proper accessibility label
   */
  describe('Property 3: Featured Event Indicator Display', () => {
    it('should display featured indicator only when is_featured is true', () => {
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

            if (event.is_featured === true) {
              // Featured indicator MUST appear when is_featured is true
              expect(featuredBadge).toBeInTheDocument()
              expect(featuredBadge).toHaveClass('bg-blue-600', 'text-white')
            } else {
              // Featured indicator MUST NOT appear when is_featured is false
              expect(featuredBadge).not.toBeInTheDocument()
            }

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not display featured indicator when is_featured is false or missing', () => {
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
            is_featured: fc.oneof(
              fc.constant(false),
              fc.constant(null),
              fc.constant(undefined)
            )
          }),
          (event) => {
            const { unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.queryByText('Featured')

            // Featured indicator MUST NOT appear when is_featured is false, null, or undefined
            expect(featuredBadge).not.toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should apply correct styling to featured indicator', () => {
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
            )
          }),
          (event) => {
            const eventWithFeatured = { ...event, is_featured: true }
            const { unmount } = render(
              <EventCard event={eventWithFeatured} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.getByText('Featured')

            // Featured indicator must have correct styling classes
            expect(featuredBadge).toHaveClass('text-xs')
            expect(featuredBadge).toHaveClass('bg-blue-600')
            expect(featuredBadge).toHaveClass('text-white')
            expect(featuredBadge).toHaveClass('px-2')
            expect(featuredBadge).toHaveClass('py-1')
            expect(featuredBadge).toHaveClass('rounded')

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have proper accessibility label for featured indicator', () => {
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
            )
          }),
          (event) => {
            const eventWithFeatured = { ...event, is_featured: true }
            const { unmount } = render(
              <EventCard event={eventWithFeatured} onSelect={mockOnSelect} />
            )

            const featuredBadge = screen.getByLabelText('Featured event')

            // Featured indicator must have proper accessibility label
            expect(featuredBadge).toBeInTheDocument()
            expect(featuredBadge).toHaveAttribute('aria-label', 'Featured event')

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display featured indicator alongside other badges', () => {
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
            )
          }),
          (event) => {
            const eventWithFeatured = { ...event, is_featured: true }
            const { unmount } = render(
              <EventCard event={eventWithFeatured} onSelect={mockOnSelect} />
            )

            // Featured indicator should appear alongside event type badge
            const featuredBadge = screen.getByText('Featured')
            const typeBadge = screen.getByText(event.event_type)

            expect(featuredBadge).toBeInTheDocument()
            expect(typeBadge).toBeInTheDocument()

            // Both badges should be in the same container (flex gap-2)
            const badgeContainer = featuredBadge.parentElement
            expect(badgeContainer).toContainElement(typeBadge)

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain featured indicator visibility across different event types', () => {
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
              status: fc.oneof(
                fc.constant('upcoming'),
                fc.constant('ongoing'),
                fc.constant('completed')
              ),
              is_featured: fc.constant(true)
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (events) => {
            events.forEach(event => {
              const { unmount } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )

              // Featured indicator should appear for all event types when is_featured is true
              const featuredBadge = screen.getByText('Featured')
              expect(featuredBadge).toBeInTheDocument()

              unmount()
            })
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})
