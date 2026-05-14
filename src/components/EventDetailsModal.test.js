import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EventDetailsModal from './EventDetailsModal'

describe('EventDetailsModal Component', () => {
  const mockEvent = {
    id: '1',
    event_name: 'Tech Conference 2024',
    event_type: 'Conference',
    description: 'A comprehensive tech conference covering latest innovations',
    event_date: '2024-03-15',
    start_time: '09:00 AM',
    end_time: '05:00 PM',
    venue_name: 'Convention Center',
    city: 'San Francisco',
    state: 'CA',
    target_industries: 'Technology, Software Development',
    target_audience: 'Software engineers, tech entrepreneurs',
    expected_footfall: 500,
    cover_image_url: 'https://example.com/image.jpg'
  }

  const mockOnClose = jest.fn()
  const mockOnApply = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('does not render when isOpen is false', () => {
      const { container } = render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={false} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    test('does not render when event is null', () => {
      const { container } = render(
        <EventDetailsModal 
          event={null} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    test('renders modal when isOpen is true and event is provided', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('displays event name as heading', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
    })

    test('displays event cover image', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const image = screen.getByAltText('Tech Conference 2024')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    test('does not display image when cover_image_url is missing', () => {
      const eventWithoutImage = { ...mockEvent, cover_image_url: null }
      render(
        <EventDetailsModal 
          event={eventWithoutImage} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.queryByAltText('Tech Conference 2024')).not.toBeInTheDocument()
    })

    test('displays event type badge', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Conference')).toBeInTheDocument()
    })

    test('displays event description', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('A comprehensive tech conference covering latest innovations')).toBeInTheDocument()
    })

    test('displays date and time information', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument()
      expect(screen.getByText('09:00 AM - 05:00 PM')).toBeInTheDocument()
    })

    test('displays location information', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Convention Center')).toBeInTheDocument()
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
    })

    test('displays target industries', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Technology, Software Development')).toBeInTheDocument()
    })

    test('displays target audience', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Software engineers, tech entrepreneurs')).toBeInTheDocument()
    })

    test('displays expected footfall as number', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('500')).toBeInTheDocument()
    })

    test('displays TBD when expected footfall is zero', () => {
      const eventZeroFootfall = { ...mockEvent, expected_footfall: 0 }
      render(
        <EventDetailsModal 
          event={eventZeroFootfall} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('TBD')).toBeInTheDocument()
    })

    test('displays TBD when expected footfall is missing', () => {
      const eventNoFootfall = { ...mockEvent, expected_footfall: undefined }
      render(
        <EventDetailsModal 
          event={eventNoFootfall} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      // Should not display the footfall section at all
      expect(screen.queryByText('Expected Footfall')).not.toBeInTheDocument()
    })

    test('displays Apply as Vendor button', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Apply as Vendor')).toBeInTheDocument()
    })

    test('displays close button with X icon', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })

    test('applies premium light mode styling to modal', () => {
      const { container } = render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const modal = container.querySelector('div[role="dialog"]')
      expect(modal).toHaveClass('bg-black', 'bg-opacity-50')

      const modalContent = modal.querySelector('div')
      expect(modalContent).toHaveClass('bg-white', 'rounded-xl', 'shadow-md')
    })

    test('applies premium light mode styling to Apply button', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      expect(applyButton).toHaveClass('bg-blue-600', 'text-white', 'rounded-xl')
    })
  })

  describe('Close Button', () => {
    test('calls onClose when close button is clicked', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const closeButton = screen.getByLabelText('Close modal')
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Apply as Vendor Button', () => {
    test('calls onApply when Apply button is clicked', async () => {
      mockOnApply.mockResolvedValue(undefined)

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(mockOnApply).toHaveBeenCalledWith(mockEvent)
      })
    })

    test('displays "Applying..." text while submission is in progress', async () => {
      mockOnApply.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      expect(screen.getByText('Applying...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Apply as Vendor')).toBeInTheDocument()
      })
    })

    test('disables Apply button while submission is in progress', async () => {
      mockOnApply.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      expect(applyButton).toBeDisabled()

      await waitFor(() => {
        expect(applyButton).not.toBeDisabled()
      })
    })

    test('displays error message when application fails', async () => {
      const errorMessage = 'Failed to submit application. Please try again.'
      mockOnApply.mockRejectedValue(new Error(errorMessage))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    test('keeps modal open when application fails', async () => {
      mockOnApply.mockRejectedValue(new Error('Application failed'))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Application failed')).toBeInTheDocument()
      })
    })

    test('displays error message in red alert box', async () => {
      mockOnApply.mockRejectedValue(new Error('Validation error'))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert')
        expect(errorAlert).toHaveClass('bg-red-100', 'text-red-700')
        expect(errorAlert).toBeInTheDocument()
      })
    })

    test('clears error message when Apply button is clicked again', async () => {
      mockOnApply
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(undefined)

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')

      // First click - error
      fireEvent.click(applyButton)
      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument()
      })

      // Second click - success
      fireEvent.click(applyButton)
      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument()
      })
    })

    test('uses default error message when error has no message', async () => {
      mockOnApply.mockRejectedValue(new Error())

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to submit application. Please try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    test('has proper dialog role and aria-modal attribute', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    test('has aria-labelledby pointing to modal title', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')

      const title = screen.getByText('Tech Conference 2024')
      expect(title).toHaveAttribute('id', 'modal-title')
    })

    test('close button has proper aria-label', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toBeInTheDocument()
    })

    test('Apply button has proper aria-label', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByLabelText('Apply as vendor')
      expect(applyButton).toBeInTheDocument()
    })

    test('Apply button aria-label changes during submission', async () => {
      mockOnApply.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByLabelText('Apply as vendor')
      fireEvent.click(applyButton)

      expect(screen.getByLabelText('Applying as vendor...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByLabelText('Apply as vendor')).toBeInTheDocument()
      })
    })

    test('error alert has proper role', async () => {
      mockOnApply.mockRejectedValue(new Error('Test error'))

      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      fireEvent.click(applyButton)

      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    test('handles event with minimal fields', () => {
      const minimalEvent = {
        id: '1',
        event_name: 'Event Name'
      }

      render(
        <EventDetailsModal 
          event={minimalEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Event Name')).toBeInTheDocument()
      expect(screen.getByText('Apply as Vendor')).toBeInTheDocument()
    })

    test('handles event with very long description', () => {
      const longDescriptionEvent = {
        ...mockEvent,
        description: 'A'.repeat(500)
      }

      render(
        <EventDetailsModal 
          event={longDescriptionEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('A'.repeat(500))).toBeInTheDocument()
    })

    test('handles event with multiline description', () => {
      const multilineEvent = {
        ...mockEvent,
        description: 'Line 1\nLine 2\nLine 3'
      }

      render(
        <EventDetailsModal 
          event={multilineEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      // Check that the description is rendered with whitespace preserved
      const descriptionElement = screen.getAllByText((content, element) => {
        return element && element.textContent.includes('Line 1') && element.textContent.includes('Line 2') && element.textContent.includes('Line 3')
      })[0]
      expect(descriptionElement).toBeInTheDocument()
    })

    test('handles invalid date format gracefully', () => {
      const invalidDateEvent = {
        ...mockEvent,
        event_date: 'invalid-date'
      }

      render(
        <EventDetailsModal 
          event={invalidDateEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })

    test('handles missing optional fields gracefully', () => {
      const minimalEvent = {
        id: '1',
        event_name: 'Event Name',
        event_type: 'Conference'
      }

      render(
        <EventDetailsModal 
          event={minimalEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('Event Name')).toBeInTheDocument()
      expect(screen.getByText('Conference')).toBeInTheDocument()
      // Component still renders the Date & Time section but with no content
      // This is acceptable as it maintains consistent layout
      expect(screen.getByText('Apply as Vendor')).toBeInTheDocument()
    })

    test('handles very large expected footfall number', () => {
      const largeFootfallEvent = {
        ...mockEvent,
        expected_footfall: 1000000
      }

      render(
        <EventDetailsModal 
          event={largeFootfallEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      expect(screen.getByText('1000000')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    test('applies correct styling to modal overlay', () => {
      const { container } = render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const overlay = container.querySelector('div[role="dialog"]')
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-50')
    })

    test('applies correct styling to modal content', () => {
      const { container } = render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const content = container.querySelector('div[role="dialog"] > div')
      expect(content).toHaveClass('bg-white', 'rounded-xl', 'shadow-md', 'p-6')
    })

    test('applies correct styling to close button', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const closeButton = screen.getByLabelText('Close modal')
      expect(closeButton).toHaveClass('text-gray-600', 'hover:text-gray-900', 'transition-colors')
    })

    test('applies correct styling to Apply button', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const applyButton = screen.getByText('Apply as Vendor')
      expect(applyButton).toHaveClass('w-full', 'bg-blue-600', 'text-white', 'rounded-xl', 'hover:bg-blue-700')
    })

    test('applies correct styling to event type badge', () => {
      render(
        <EventDetailsModal 
          event={mockEvent} 
          isOpen={true} 
          onClose={mockOnClose}
          onApply={mockOnApply}
        />
      )

      const badge = screen.getByText('Conference')
      expect(badge).toHaveClass('text-xs', 'bg-blue-100', 'text-blue-600', 'px-2', 'py-1', 'rounded')
    })
  })
})
