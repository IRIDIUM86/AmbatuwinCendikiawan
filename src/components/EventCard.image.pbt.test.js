import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import EventCard from './EventCard'

/**
 * Property-Based Tests for Event Image Display with Fallback
 * 
 * **Validates: Requirements 21.1**
 * 
 * These tests verify universal properties about image rendering
 * and fallback behavior across all possible image URL scenarios.
 */
describe('EventCard Component - Property 5: Event Image Display with Fallback', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Property 5: Event Image Display with Fallback
   * 
   * **Validates: Requirements 21.1**
   * 
   * Universal properties:
   * 1. When cover_image_url is a valid URL, the image element is rendered with that URL
   * 2. When cover_image_url is null or undefined, the fallback placeholder is displayed
   * 3. When cover_image_url is an invalid URL, the fallback placeholder is displayed after error
   * 4. The fallback placeholder displays "No Image" text
   * 5. The fallback placeholder has gray background (bg-gray-300)
   * 6. The image element has correct alt text matching event name
   * 7. The image container maintains consistent height (h-40)
   * 8. The image container has rounded corners (rounded-lg)
   * 9. The image uses object-cover for proper scaling
   * 10. The fallback placeholder is centered and visible
   */
  describe('Property 5: Event Image Display with Fallback', () => {
    it('should display valid image URL when cover_image_url is provided', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.webUrl(),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const { unmount, container } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Image element should be rendered with the provided URL
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
            expect(image).toHaveAttribute('src', event.cover_image_url)
            expect(image).toHaveClass('w-full', 'h-full', 'object-cover')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display fallback placeholder when cover_image_url is null', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.constant(null),
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

            // Fallback placeholder should be displayed
            expect(screen.getByText('No Image')).toBeInTheDocument()

            // Image element should not be rendered
            const image = screen.queryByAltText(event.event_name)
            expect(image).not.toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display fallback placeholder when cover_image_url is undefined', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.constant(undefined),
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

            // Fallback placeholder should be displayed
            expect(screen.getByText('No Image')).toBeInTheDocument()

            // Image element should not be rendered
            const image = screen.queryByAltText(event.event_name)
            expect(image).not.toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display fallback placeholder when cover_image_url is empty string', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.constant(''),
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

            // Fallback placeholder should be displayed
            expect(screen.getByText('No Image')).toBeInTheDocument()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display fallback placeholder when image fails to load', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.webUrl(),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const { unmount, container } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Get the image element
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()

            // Simulate image load error
            fireEvent.error(image)

            // After error, fallback placeholder should be visible
            const placeholders = screen.getAllByText('No Image')
            expect(placeholders.length).toBeGreaterThan(0)
            expect(placeholders[0]).toBeVisible()

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should maintain consistent image container styling for all URL types', () => {
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
              fc.constant(undefined),
              fc.constant(''),
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
            const { container, unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Image container should always have consistent styling
            const imageContainer = container.querySelector('.w-full.h-40.bg-gray-200.rounded-lg')
            expect(imageContainer).toBeInTheDocument()
            expect(imageContainer).toHaveClass('w-full', 'h-40', 'bg-gray-200', 'rounded-lg', 'mb-3', 'overflow-hidden')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should display fallback placeholder with correct styling', () => {
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
              fc.constant(undefined),
              fc.constant('')
            ),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const { container, unmount } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Fallback placeholder should have correct styling
            const placeholders = screen.getAllByText('No Image')
            const placeholder = placeholders[0]
            expect(placeholder).toHaveClass('text-sm')

            // Placeholder container should have correct styling
            const placeholderContainer = placeholder.parentElement
            expect(placeholderContainer).toHaveClass('w-full', 'h-full', 'bg-gray-300', 'flex', 'items-center', 'justify-center', 'text-gray-500')

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should render image with correct alt text for accessibility', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string({ minLength: 1 }),
            event_type: fc.string({ minLength: 1 }),
            event_date: fc.date().map(d => d.toISOString().split('T')[0]),
            city: fc.string({ minLength: 1 }),
            state: fc.string({ minLength: 1, maxLength: 2 }),
            cover_image_url: fc.webUrl(),
            status: fc.oneof(
              fc.constant('upcoming'),
              fc.constant('ongoing'),
              fc.constant('completed')
            ),
            is_featured: fc.boolean()
          }),
          (event) => {
            const { unmount, container } = render(
              <EventCard event={event} onSelect={mockOnSelect} />
            )

            // Image should have alt text matching event name
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
            expect(image).toHaveAttribute('alt', event.event_name)

            unmount()
          }
        ),
        { numRuns: 15 }
      )
    })

    it('should handle mixed valid and invalid URLs consistently', () => {
      fc.assert(
        fc.property(
          fc.array(
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
            { minLength: 1, maxLength: 5 }
          ),
          (events) => {
            events.forEach(event => {
              const { unmount } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )

              if (event.cover_image_url) {
                // Valid URL should render image
                const image = screen.getByAltText(event.event_name)
                expect(image).toBeInTheDocument()
                expect(image).toHaveAttribute('src', event.cover_image_url)
              } else {
                // Invalid/missing URL should show placeholder
                expect(screen.getByText('No Image')).toBeInTheDocument()
              }

              unmount()
            })
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should maintain image display consistency across different event types', () => {
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
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 6 }
          ),
          (events) => {
            events.forEach(event => {
              const { unmount } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )

              // Image container should always be present and styled correctly
              const { container } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )
              const imageContainer = container.querySelector('.w-full.h-40.bg-gray-200.rounded-lg')
              expect(imageContainer).toBeInTheDocument()

              unmount()
            })
          }
        ),
        { numRuns: 10 }
      )
    })

    it('should display placeholder text "No Image" for all missing URL scenarios', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_name: fc.string({ minLength: 1 }),
              event_type: fc.string({ minLength: 1 }),
              event_date: fc.date().map(d => d.toISOString().split('T')[0]),
              city: fc.string({ minLength: 1 }),
              state: fc.string({ minLength: 1, maxLength: 2 }),
              cover_image_url: fc.oneof(
                fc.constant(null),
                fc.constant(undefined),
                fc.constant('')
              ),
              status: fc.oneof(
                fc.constant('upcoming'),
                fc.constant('ongoing'),
                fc.constant('completed')
              ),
              is_featured: fc.boolean()
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (events) => {
            events.forEach(event => {
              const { unmount } = render(
                <EventCard event={event} onSelect={mockOnSelect} />
              )

              // All missing URL scenarios should display "No Image"
              expect(screen.getByText('No Image')).toBeInTheDocument()

              unmount()
            })
          }
        ),
        { numRuns: 10 }
      )
    })
  })
})
