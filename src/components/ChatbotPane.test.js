import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatbotPane from './ChatbotPane'

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

describe('ChatbotPane Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders with initial greeting message', () => {
    render(<ChatbotPane />)
    expect(screen.getByText(/Hello! I'm your AI assistant/)).toBeInTheDocument()
  })

  test('displays AI Assistant header', () => {
    render(<ChatbotPane />)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  test('initializes with empty input field', () => {
    render(<ChatbotPane />)
    const input = screen.getByPlaceholderText('Type your message...')
    expect(input.value).toBe('')
  })

  test('send button is disabled when input is empty', () => {
    render(<ChatbotPane />)
    const sendButton = screen.getByLabelText('Send message')
    expect(sendButton).toBeDisabled()
  })

  test('send button is enabled when input has text', async () => {
    render(<ChatbotPane />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Test')

    expect(sendButton).not.toBeDisabled()
  })

  test('adds user message to chat when Send button clicked', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Hello AI')
    fireEvent.click(sendButton)

    expect(screen.getByText('Hello AI')).toBeInTheDocument()
  })

  test('clears input field after sending message', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Test message')
    fireEvent.click(sendButton)

    expect(input.value).toBe('')
  })

  test('does not send empty messages', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const sendButton = screen.getByLabelText('Send message')

    fireEvent.click(sendButton)

    expect(mockCallback).not.toHaveBeenCalled()
  })

  test('sends message on Enter key press', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')

    await userEvent.type(input, 'Test message{Enter}')

    expect(mockCallback).toHaveBeenCalledWith('Test message')
  })

  test('calls onSendMessage callback when provided', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('AI response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Test message')
    fireEvent.click(sendButton)

    expect(mockCallback).toHaveBeenCalledWith('Test message')
  })

  test('displays AI response in chat', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('This is the AI response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Hello')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText('This is the AI response')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  test('handles API errors gracefully', async () => {
    const mockCallback = jest.fn(() => Promise.reject(new Error('API Error')))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'Test')
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Error: API Error/)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  test('user messages have blue background', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'User msg')
    fireEvent.click(sendButton)

    const userMessage = screen.getByText('User msg').closest('div')
    expect(userMessage).toHaveClass('bg-blue-600')
  })

  test('user messages have white text', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'User msg')
    fireEvent.click(sendButton)

    const userMessage = screen.getByText('User msg').closest('div')
    expect(userMessage).toHaveClass('text-white')
  })

  test('AI messages have gray background', () => {
    render(<ChatbotPane />)
    const aiMessage = screen.getByText(/Hello! I'm your AI assistant/).closest('div')
    expect(aiMessage).toHaveClass('bg-gray-200')
  })

  test('AI messages have dark gray text', () => {
    render(<ChatbotPane />)
    const aiMessage = screen.getByText(/Hello! I'm your AI assistant/).closest('div')
    expect(aiMessage).toHaveClass('text-gray-900')
  })

  test('messages have rounded corners', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'TestMsg')
    fireEvent.click(sendButton)

    const userMessage = screen.getByText('TestMsg').closest('div')
    expect(userMessage).toHaveClass('rounded-xl')
  })

  test('messages have shadow', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'TestMsg2')
    fireEvent.click(sendButton)

    const userMessage = screen.getByText('TestMsg2').closest('div')
    expect(userMessage).toHaveClass('shadow-md')
  })

  test('user messages are right-aligned', async () => {
    const mockCallback = jest.fn(() => Promise.resolve('Response'))
    render(<ChatbotPane onSendMessage={mockCallback} />)
    const input = screen.getByPlaceholderText('Type your message...')
    const sendButton = screen.getByLabelText('Send message')

    await userEvent.type(input, 'User message')
    fireEvent.click(sendButton)

    const messageContainer = screen.getByText('User message').closest('div').parentElement
    expect(messageContainer).toHaveClass('justify-end')
  })

  test('AI messages are left-aligned', () => {
    render(<ChatbotPane />)
    const messageContainer = screen.getByText(/Hello! I'm your AI assistant/).closest('div').parentElement
    expect(messageContainer).toHaveClass('justify-start')
  })

  test('textarea supports multi-line input', () => {
    render(<ChatbotPane />)
    const input = screen.getByPlaceholderText('Type your message...')
    expect(input.tagName).toBe('TEXTAREA')
  })

  test('displays character count', () => {
    render(<ChatbotPane />)
    const countText = screen.getByText((content, element) => {
      return element && element.textContent.includes('/1000')
    })
    expect(countText).toBeInTheDocument()
  })

  test('enforces maximum character limit of 1000', async () => {
    render(<ChatbotPane />)
    const input = screen.getByPlaceholderText('Type your message...')

    const longText = 'a'.repeat(1100)
    await userEvent.type(input, longText, { delay: 0 })

    expect(input.value.length).toBeLessThanOrEqual(1000)
  }, 10000)
})
