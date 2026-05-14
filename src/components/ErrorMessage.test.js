import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage Component', () => {
  describe('Error Message Display', () => {
    test('renders error message text', () => {
      const errorText = 'Failed to load events. Please try again.'
      render(<ErrorMessage error={errorText} />)
      
      expect(screen.getByText(errorText)).toBeInTheDocument()
    })

    test('renders default error message when error prop is not provided', () => {
      render(<ErrorMessage />)
      
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument()
    })

    test('applies correct styling to error message text', () => {
      render(<ErrorMessage error="Test error" />)
      
      const messageElement = screen.getByText('Test error')
      expect(messageElement).toHaveClass('text-gray-900')
      expect(messageElement).toHaveClass('text-center')
      expect(messageElement).toHaveClass('font-medium')
    })
  })

  describe('Error Icon Display', () => {
    test('renders error icon', () => {
      const { container } = render(<ErrorMessage error="Test error" />)
      
      // Check that the AlertCircle icon is rendered (lucide-react renders SVG)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('applies correct styling to error icon', () => {
      const { container } = render(<ErrorMessage error="Test error" />)
      
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('text-red-600')
    })
  })

  describe('Retry Button', () => {
    test('renders retry button when onRetry callback is provided', () => {
      const mockRetry = jest.fn()
      render(<ErrorMessage error="Test error" onRetry={mockRetry} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()
    })

    test('does not render retry button when onRetry callback is not provided', () => {
      render(<ErrorMessage error="Test error" />)
      
      const retryButton = screen.queryByRole('button', { name: /retry/i })
      expect(retryButton).not.toBeInTheDocument()
    })

    test('calls onRetry callback when retry button is clicked', () => {
      const mockRetry = jest.fn()
      render(<ErrorMessage error="Test error" onRetry={mockRetry} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      fireEvent.click(retryButton)
      
      expect(mockRetry).toHaveBeenCalledTimes(1)
    })

    test('applies correct styling to retry button', () => {
      render(<ErrorMessage error="Test error" onRetry={() => {}} />)
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toHaveClass('bg-red-600')
      expect(retryButton).toHaveClass('text-white')
      expect(retryButton).toHaveClass('rounded-xl')
      expect(retryButton).toHaveClass('hover:bg-red-700')
    })
  })

  describe('Premium Light Mode Styling', () => {
    test('applies premium light mode styling with red/orange accent', () => {
      const { container } = render(<ErrorMessage error="Test error" onRetry={() => {}} />)
      
      const errorContainer = container.querySelector('div')
      expect(errorContainer).toHaveClass('bg-red-50')
      expect(errorContainer).toHaveClass('border')
      expect(errorContainer).toHaveClass('border-red-200')
      expect(errorContainer).toHaveClass('rounded-xl')
      expect(errorContainer).toHaveClass('shadow-md')
    })

    test('applies flex layout styling', () => {
      const { container } = render(<ErrorMessage error="Test error" />)
      
      const errorContainer = container.querySelector('div')
      expect(errorContainer).toHaveClass('flex')
      expect(errorContainer).toHaveClass('flex-col')
      expect(errorContainer).toHaveClass('items-center')
      expect(errorContainer).toHaveClass('justify-center')
    })

    test('applies padding styling', () => {
      const { container } = render(<ErrorMessage error="Test error" />)
      
      const errorContainer = container.querySelector('div')
      expect(errorContainer).toHaveClass('p-6')
    })
  })

  describe('Snapshot Test', () => {
    test('error message renders correctly and matches snapshot', () => {
      const { container } = render(<ErrorMessage error="Test error" onRetry={() => {}} />)
      expect(container.querySelector('div')).toMatchSnapshot()
    })
  })
})
