import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EventFilter from './EventFilter'

describe('EventFilter Component', () => {
  const mockEventTypes = ['Conference', 'Workshop', 'Networking']
  const mockLocations = ['New York, NY', 'San Francisco, CA', 'Austin, TX']
  const mockFilters = { type: '', location: '' }
  const mockOnFilterChange = jest.fn()
  const mockOnClearFilters = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders filter dropdowns with available options', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      // Check event type dropdown
      const typeSelect = screen.getByLabelText('Filter by event type')
      expect(typeSelect).toBeInTheDocument()
      expect(typeSelect).toHaveValue('')

      // Check location dropdown
      const locationSelect = screen.getByLabelText('Filter by location')
      expect(locationSelect).toBeInTheDocument()
      expect(locationSelect).toHaveValue('')

      // Check default options
      expect(screen.getByText('All Types')).toBeInTheDocument()
      expect(screen.getByText('All Locations')).toBeInTheDocument()

      // Check event type options
      mockEventTypes.forEach(type => {
        expect(screen.getByText(type)).toBeInTheDocument()
      })

      // Check location options
      mockLocations.forEach(location => {
        expect(screen.getByText(location)).toBeInTheDocument()
      })
    })

    test('applies sticky positioning class', () => {
      const { container } = render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const filterDiv = container.querySelector('.sticky')
      expect(filterDiv).toBeInTheDocument()
      expect(filterDiv).toHaveClass('bottom-0')
    })

    test('applies premium light mode styling', () => {
      const { container } = render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const filterDiv = container.querySelector('.sticky')
      expect(filterDiv).toHaveClass('bg-white')
      expect(filterDiv).toHaveClass('border-t')
      expect(filterDiv).toHaveClass('border-gray-200')
      expect(filterDiv).toHaveClass('shadow-md')
    })

    test('does not show clear filters button when no filters are active', () => {
      render(
        <EventFilter
          filters={{ type: '', location: '' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.queryByLabelText('Clear all filters')
      expect(clearButton).not.toBeInTheDocument()
    })

    test('shows clear filters button when type filter is active', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: '' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.getByLabelText('Clear all filters')
      expect(clearButton).toBeInTheDocument()
      expect(clearButton).toHaveTextContent('Clear Filters')
    })

    test('shows clear filters button when location filter is active', () => {
      render(
        <EventFilter
          filters={{ type: '', location: 'New York, NY' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.getByLabelText('Clear all filters')
      expect(clearButton).toBeInTheDocument()
    })

    test('shows clear filters button when both filters are active', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: 'New York, NY' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.getByLabelText('Clear all filters')
      expect(clearButton).toBeInTheDocument()
    })
  })

  describe('Filter Change Handlers', () => {
    test('calls onFilterChange when event type is selected', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const typeSelect = screen.getByLabelText('Filter by event type')
      fireEvent.change(typeSelect, { target: { value: 'Conference' } })

      expect(mockOnFilterChange).toHaveBeenCalledWith('type', 'Conference')
    })

    test('calls onFilterChange when location is selected', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const locationSelect = screen.getByLabelText('Filter by location')
      fireEvent.change(locationSelect, { target: { value: 'New York, NY' } })

      expect(mockOnFilterChange).toHaveBeenCalledWith('location', 'New York, NY')
    })

    test('calls onFilterChange with empty string when filter is cleared', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: '' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const typeSelect = screen.getByLabelText('Filter by event type')
      fireEvent.change(typeSelect, { target: { value: '' } })

      expect(mockOnFilterChange).toHaveBeenCalledWith('type', '')
    })
  })

  describe('Clear Filters Button', () => {
    test('calls onClearFilters when clear button is clicked', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: 'New York, NY' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.getByLabelText('Clear all filters')
      fireEvent.click(clearButton)

      expect(mockOnClearFilters).toHaveBeenCalled()
    })

    test('clear button has correct styling', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: '' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const clearButton = screen.getByLabelText('Clear all filters')
      expect(clearButton).toHaveClass('w-full')
      expect(clearButton).toHaveClass('px-3')
      expect(clearButton).toHaveClass('py-2')
      expect(clearButton).toHaveClass('text-sm')
      expect(clearButton).toHaveClass('text-gray-600')
      expect(clearButton).toHaveClass('border')
      expect(clearButton).toHaveClass('border-gray-300')
      expect(clearButton).toHaveClass('rounded-xl')
      expect(clearButton).toHaveClass('hover:bg-gray-50')
    })
  })

  describe('Dropdown Styling', () => {
    test('event type dropdown has correct styling', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const typeSelect = screen.getByLabelText('Filter by event type')
      expect(typeSelect).toHaveClass('px-3')
      expect(typeSelect).toHaveClass('py-2')
      expect(typeSelect).toHaveClass('border')
      expect(typeSelect).toHaveClass('border-gray-300')
      expect(typeSelect).toHaveClass('rounded-xl')
      expect(typeSelect).toHaveClass('text-sm')
      expect(typeSelect).toHaveClass('text-gray-900')
      expect(typeSelect).toHaveClass('focus:outline-none')
      expect(typeSelect).toHaveClass('focus:ring-2')
      expect(typeSelect).toHaveClass('focus:ring-blue-600')
    })

    test('location dropdown has correct styling', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      const locationSelect = screen.getByLabelText('Filter by location')
      expect(locationSelect).toHaveClass('px-3')
      expect(locationSelect).toHaveClass('py-2')
      expect(locationSelect).toHaveClass('border')
      expect(locationSelect).toHaveClass('border-gray-300')
      expect(locationSelect).toHaveClass('rounded-xl')
      expect(locationSelect).toHaveClass('text-sm')
      expect(locationSelect).toHaveClass('text-gray-900')
      expect(locationSelect).toHaveClass('focus:outline-none')
      expect(locationSelect).toHaveClass('focus:ring-2')
      expect(locationSelect).toHaveClass('focus:ring-blue-600')
    })
  })

  describe('Empty Data Handling', () => {
    test('renders with empty event types array', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={[]}
          locations={mockLocations}
        />
      )

      const typeSelect = screen.getByLabelText('Filter by event type')
      expect(typeSelect).toBeInTheDocument()
      expect(screen.getByText('All Types')).toBeInTheDocument()
    })

    test('renders with empty locations array', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={[]}
        />
      )

      const locationSelect = screen.getByLabelText('Filter by location')
      expect(locationSelect).toBeInTheDocument()
      expect(screen.getByText('All Locations')).toBeInTheDocument()
    })

    test('renders with default props when none provided', () => {
      render(<EventFilter />)

      const typeSelect = screen.getByLabelText('Filter by event type')
      const locationSelect = screen.getByLabelText('Filter by location')

      expect(typeSelect).toBeInTheDocument()
      expect(locationSelect).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('dropdowns have aria-label attributes', () => {
      render(
        <EventFilter
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      expect(screen.getByLabelText('Filter by event type')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter by location')).toBeInTheDocument()
    })

    test('clear button has aria-label attribute', () => {
      render(
        <EventFilter
          filters={{ type: 'Conference', location: '' }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          eventTypes={mockEventTypes}
          locations={mockLocations}
        />
      )

      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument()
    })
  })
})
