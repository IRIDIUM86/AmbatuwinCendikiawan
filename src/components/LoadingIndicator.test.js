import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator Component', () => {
  it('renders with default loading message', () => {
    render(<LoadingIndicator />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom loading message', () => {
    render(<LoadingIndicator message="Processing..." />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('renders spinner animation element', () => {
    const { container } = render(<LoadingIndicator />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('applies premium light mode styling', () => {
    const { container } = render(<LoadingIndicator />)
    
    // Check for premium light mode classes
    const messageElement = screen.getByText('Loading...')
    expect(messageElement).toHaveClass('text-gray-600')
    expect(messageElement).toHaveClass('text-base')
    expect(messageElement).toHaveClass('font-medium')
    
    // Check spinner styling
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('border-gray-200')
    expect(spinner).toHaveClass('border-t-blue-600')
    expect(spinner).toHaveClass('rounded-full')
  })

  it('renders spinner with correct dimensions', () => {
    const { container } = render(<LoadingIndicator />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-12')
    expect(spinner).toHaveClass('h-12')
  })

  it('centers content vertically and horizontally', () => {
    const { container } = render(<LoadingIndicator />)
    const wrapper = container.querySelector('.flex')
    expect(wrapper).toHaveClass('flex-col')
    expect(wrapper).toHaveClass('items-center')
    expect(wrapper).toHaveClass('justify-center')
  })

  it('applies appropriate padding', () => {
    const { container } = render(<LoadingIndicator />)
    const wrapper = container.querySelector('.flex')
    expect(wrapper).toHaveClass('py-12')
    expect(wrapper).toHaveClass('px-4')
  })

  it('has proper spacing between spinner and message', () => {
    const { container } = render(<LoadingIndicator />)
    const spinnerContainer = container.querySelector('.mb-4')
    expect(spinnerContainer).toBeInTheDocument()
  })
})
