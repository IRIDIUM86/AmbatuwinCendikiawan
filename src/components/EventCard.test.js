import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

describe('EventCard Component', () => {
  const mockEvent = {
    id: '1',
    event_name: 'Tech Conference 2024',
    event_type: 'Conference',
    event_date: '2024-03-15',
    city: 'San Francisco',
    state: 'CA',
    cover_image_url: 'https://example.com/image.jpg',
    is_featured: true,
    status: 'upcoming'
  }

  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders event card with all required fields', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
      expect(screen.getByText('Conference')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('Upcoming')).toBeInTheDocument()
    })

    test('renders event date in formatted format', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      // Date should be formatted as "Mar 15, 2024"
      expect(screen.getByText(/Mar 15, 2024/)).toBeInTheDocument()
    })

    test('renders event cover image when cover_image_url is provided', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const image = screen.getByAltText('Tech Conference 2024')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    test('renders placeholder when cover_image_url is missing', () => {
      const eventWithoutImage = { ...mockEvent, cover_image_url: null }
      render(<EventCard event={eventWithoutImage} onSelect={mockOnSelect} />)

      expect(screen.getByText('No Image')).toBeInTheDocument()
    })

    test('renders featured badge only when is_featured is true', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    test('does not render featured badge when is_featured is false', () => {
      const eventNotFeatured = { ...mockEvent, is_featured: false }
      render(<EventCard event={eventNotFeatured} onSelect={mockOnSelect} />)

      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })

    test('renders status badge with correct status text', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      expect(screen.getByText('Upcoming')).toBeInTheDocument()
    })

    test('renders status badge with correct color for upcoming status', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const statusBadge = screen.getByText('Upcoming')
      expect(statusBadge).toHaveClass('bg-green-100', 'text-green-600')
    })

    test('renders status badge with correct color for ongoing status', () => {
      const ongoingEvent = { ...mockEvent, status: 'ongoing' }
      render(<EventCard event={ongoingEvent} onSelect={mockOnSelect} />)

      const statusBadge = screen.getByText('Ongoing')
      expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-600')
    })

    test('renders status badge with correct color for completed status', () => {
      const completedEvent = { ...mockEvent, status: 'completed' }
      render(<EventCard event={completedEvent} onSelect={mockOnSelect} />)

      const statusBadge = screen.getByText('Completed')
      expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-600')
    })

    test('applies premium light mode styling classes', () => {
      const { container } = render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const cardDiv = container.querySelector('div[role="button"]')
      expect(cardDiv).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
    })

    test('returns null when event is not provided', () => {
      const { container } = render(<EventCard event={null} onSelect={mockOnSelect} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Click Handler', () => {
    test('calls onSelect callback when card is clicked', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(mockOnSelect).toHaveBeenCalledWith(mockEvent)
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    test('calls onSelect callback when Enter key is pressed', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      fireEvent.keyPress(card, { key: 'Enter', code: 'Enter', charCode: 13 })

      expect(mockOnSelect).toHaveBeenCalledWith(mockEvent)
    })

    test('calls onSelect callback when Space key is pressed', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      fireEvent.keyPress(card, { key: ' ', code: 'Space', charCode: 32 })

      expect(mockOnSelect).toHaveBeenCalledWith(mockEvent)
    })

    test('does not call onSelect for other key presses', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      fireEvent.keyPress(card, { key: 'a', code: 'KeyA', charCode: 97 })

      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    test('has proper aria-label for event card', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'Event: Tech Conference 2024')
    })

    test('has proper aria-label for event type badge', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const typeBadge = screen.getByLabelText('Event type: Conference')
      expect(typeBadge).toBeInTheDocument()
    })

    test('has proper aria-label for featured badge', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const featuredBadge = screen.getByLabelText('Featured event')
      expect(featuredBadge).toBeInTheDocument()
    })

    test('has proper aria-label for status badge', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const statusBadge = screen.getByLabelText('Event status: upcoming')
      expect(statusBadge).toBeInTheDocument()
    })

    test('card is keyboard accessible with tabIndex', () => {
      const { container } = render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = container.querySelector('div[role="button"]')
      expect(card).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Edge Cases', () => {
    test('handles event with missing optional fields', () => {
      const minimalEvent = {
        id: '1',
        event_name: 'Event Name'
      }
      render(<EventCard event={minimalEvent} onSelect={mockOnSelect} />)

      expect(screen.getByText('Event Name')).toBeInTheDocument()
      expect(screen.getByText('No Image')).toBeInTheDocument()
    })

    test('handles event with very long event name', () => {
      const longNameEvent = {
        ...mockEvent,
        event_name: 'This is a very long event name that should be truncated to prevent layout issues'
      }
      render(<EventCard event={longNameEvent} onSelect={mockOnSelect} />)

      const heading = screen.getByText(/This is a very long event name/)
      expect(heading).toHaveClass('line-clamp-2')
    })

    test('handles invalid date format gracefully', () => {
      const invalidDateEvent = {
        ...mockEvent,
        event_date: 'invalid-date'
      }
      render(<EventCard event={invalidDateEvent} onSelect={mockOnSelect} />)

      // Invalid dates are formatted as "Invalid Date" by the formatter
      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })

    test('handles missing status gracefully', () => {
      const noStatusEvent = {
        ...mockEvent,
        status: null
      }
      render(<EventCard event={noStatusEvent} onSelect={mockOnSelect} />)

      expect(screen.queryByText(/Upcoming|Ongoing|Completed/)).not.toBeInTheDocument()
    })

    test('handles image load error by showing placeholder', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const image = screen.getByAltText('Tech Conference 2024')
      fireEvent.error(image)

      // After error, placeholder should be visible
      expect(screen.getByText('No Image')).toBeVisible()
    })
  })

  describe('Styling', () => {
    test('applies hover effect classes', () => {
      const { container } = render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = container.querySelector('div[role="button"]')
      expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow')
    })

    test('applies cursor-pointer class for click indication', () => {
      const { container } = render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const card = container.querySelector('div[role="button"]')
      expect(card).toHaveClass('cursor-pointer')
    })

    test('applies correct badge styling', () => {
      render(<EventCard event={mockEvent} onSelect={mockOnSelect} />)

      const typeBadge = screen.getByText('Conference')
      expect(typeBadge).toHaveClass('text-xs', 'bg-blue-100', 'text-blue-600', 'px-2', 'py-1', 'rounded')
    })
  })
})

/**
 * Property-Based Tests for EventCard Component
 * 
 * **Validates: Requirements 4.1, 22.1, 23.1**
 * 
 * These tests verify universal properties that should hold
 * across all possible event data scenarios.
 */
describe('EventCard Component - Property-Based Tests', () => {
  /**
   * Property 6: Event Card Information Completeness
   * 
   * **Validates: Requirements 4.1, 22.1, 23.1**
   * 
   * Universal properties:
   * 1. All required event fields are rendered in the event card
   * 2. Event name is always displayed as a heading
   * 3. Event date is formatted and displayed when present
   * 4. Event location (city, state) is displayed when present
   * 5. Event type badge is displayed when present
   * 6. Card renders without errors for any valid event object
   * 7. Card maintains all event data integrity during rendering
   */
  describe('Property 6: Event Card Information Completeness', () => {
    it('should render all required event fields for any valid event', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
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
            const mockOnSelect = jest.fn()
            const { container } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Event name should always be rendered
            expect(screen.getByText(event.event_name)).toBeInTheDocument()

            // Event type badge should be rendered
            expect(screen.getByText(event.event_type)).toBeInTheDocument()

            // Event location should be rendered
            expect(screen.getByText(`${event.city}, ${event.state}`)).toBeInTheDocument()

            // Card should have proper structure
            const card = container.querySelector('div[role="button"]')
            expect(card).toBeInTheDocument()
            expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display event name as heading for all events', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 })
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            const heading = screen.getByText(event.event_name)
            expect(heading).toBeInTheDocument()
            expect(heading.tagName).toBe('H3')
            expect(heading).toHaveClass('text-lg', 'font-bold', 'text-gray-900')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format and display event date when present', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 })
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            // Date should be formatted and displayed
            const dateString = event.event_date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
            expect(screen.getByText(dateString)).toBeInTheDocument()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display event location (city, state) when present', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 })
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            const location = screen.getByText(`${event.city}, ${event.state}`)
            expect(location).toBeInTheDocument()
            expect(location).toHaveClass('text-sm', 'text-gray-600')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display event type badge when present', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 })
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            const typeBadge = screen.getByText(event.event_type)
            expect(typeBadge).toBeInTheDocument()
            expect(typeBadge).toHaveClass('text-xs', 'bg-blue-100', 'text-blue-600')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render without errors for any valid event object', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.oneof(
              fc.constant(null),
              fc.date()
            ),
            city: fc.oneof(
              fc.constant(null),
              fc.string({ minLength: 1 })
            ),
            state: fc.oneof(
              fc.constant(null),
              fc.string({ minLength: 1, maxLength: 2 })
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
            const mockOnSelect = jest.fn()
            
            // Should not throw any errors
            expect(() => {
              render(<EventCard event={event} onSelect={mockOnSelect} />)
            }).not.toThrow()

            // Card should be rendered
            expect(screen.getByRole('button')).toBeInTheDocument()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain event data integrity during rendering', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            description: fc.string(),
            venue_name: fc.string(),
            target_industries: fc.string(),
            expected_footfall: fc.integer({ min: 0 })
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            // Click the card and verify the callback receives the original event
            const card = screen.getByRole('button')
            fireEvent.click(card)

            expect(mockOnSelect).toHaveBeenCalledWith(event)
            expect(mockOnSelect).toHaveBeenCalledTimes(1)

            // Verify the callback received the exact same object
            const callArgument = mockOnSelect.mock.calls[0][0]
            expect(callArgument).toEqual(event)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display featured indicator only when is_featured is true', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            is_featured: fc.boolean()
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            if (event.is_featured) {
              expect(screen.getByText('Featured')).toBeInTheDocument()
            } else {
              expect(screen.queryByText('Featured')).not.toBeInTheDocument()
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display status badge with correct color coding', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date(),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            )
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            render(<EventCard event={event} onSelect={mockOnSelect} />)

            const statusText = event.status.charAt(0).toUpperCase() + event.status.slice(1)
            const statusBadge = screen.getByText(statusText)
            expect(statusBadge).toBeInTheDocument()

            // Verify correct color coding
            if (event.status === 'upcoming') {
              expect(statusBadge).toHaveClass('bg-green-100', 'text-green-600')
            } else if (event.status === 'ongoing') {
              expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-600')
            } else if (event.status === 'completed') {
              expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-600')
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle missing optional fields gracefully', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.oneof(
              fc.constant(null),
              fc.constant(undefined),
              fc.date()
            ),
            city: fc.oneof(
              fc.constant(null),
              fc.constant(undefined),
              fc.string({ minLength: 1 })
            ),
            state: fc.oneof(
              fc.constant(null),
              fc.constant(undefined),
              fc.string({ minLength: 1, maxLength: 2 })
            ),
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
            )
          }),
          (event) => {
            const mockOnSelect = jest.fn()
            
            // Should not throw any errors
            expect(() => {
              render(<EventCard event={event} onSelect={mockOnSelect} />)
            }).not.toThrow()

            // Event name should always be rendered
            expect(screen.getByText(event.event_name)).toBeInTheDocument()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
