import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

/**
 * ChatbotPane Component
 * 
 * Displays the AI chatbot interface in the right pane with:
 * - Chat message history display (persistent in component state)
 * - Message input field with character limit (max 1000 chars)
 * - Send button with Enter key support
 * - Loading state during message processing
 * - Error handling for failed messages with specific error types
 * - Premium light mode styling
 * - Auto-scroll to latest message
 * 
 * State Management:
 * - messages: Array of chat messages (user and AI)
 * - inputValue: Current text in input field
 * - loading: Boolean indicating if AI is processing
 * - error: Error message if API call fails
 * 
 * Props:
 * - onSendMessage: Optional callback function when user sends a message (async)
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 18.1
 */
export default function ChatbotPane({ onSendMessage }) {
  // State for messages - persistent chat history
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI assistant. How can I help you find the perfect event for your business today?',
      role: 'ai',
      timestamp: new Date()
    }
  ])
  
  // State for input field
  const [inputValue, setInputValue] = useState('')
  
  // State for loading and error
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null)
  
  // Ref for auto-scroll
  const messagesEndRef = useRef(null)
  
  // Constants
  const MAX_CHARS = 1000
  const API_TIMEOUT = 30000 // 30 seconds

  /**
   * Auto-scroll to bottom when new messages arrive
   * Requirement 8.5: Chat_History SHALL automatically scroll to show the most recent message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /**
   * Call AI API with error handling
   * Requirement 9.1-9.8: Handle various error scenarios
   */
  const callAIAPI = async (userMessage) => {
    const apiUrl = process.env.REACT_APP_AI_API_URL

    // Check if API URL is configured
    if (!apiUrl) {
      throw new Error('AI API is not configured. Please set REACT_APP_AI_API_URL environment variable.')
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

      // Make POST request to AI API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Handle HTTP error responses (4xx, 5xx)
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        } else if (response.status >= 400) {
          throw new Error('Request error. Please check your input and try again.')
        }
      }

      // Parse response
      let data
      try {
        data = await response.json()
      } catch (err) {
        throw new Error('Invalid response from server.')
      }

      // Validate response content
      if (!data || !data.response) {
        throw new Error('No response from server.')
      }

      return data.response
    } catch (err) {
      // Handle specific error types
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.')
      } else if (err instanceof TypeError) {
        throw new Error('Network error. Please check your connection.')
      } else {
        throw err
      }
    }
  }

  /**
   * Handle sending a message
   * Requirement 8.8: WHEN a user clicks the 'Send' button or presses Enter, send message to AI_API
   * Requirement 18.1: Add message to Chat_History immediately, regardless of transmission status
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const messageText = inputValue.trim()

    // Add user message to chat immediately
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setError(null)

    try {
      // Try to call AI API first
      let aiResponse = null

      if (onSendMessage) {
        // Use provided callback (for testing or custom implementation)
        aiResponse = await onSendMessage(messageText)
      } else {
        // Call AI API directly
        aiResponse = await callAIAPI(messageText)
      }

      // Add AI response to chat
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse || 'I\'m processing your request. Please try again.',
        role: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      // Set error state
      const errorMessage = err.message || 'Failed to send message'
      setError(errorMessage)

      // Add error message to chat
      const errorChatMessage = {
        id: messages.length + 2,
        text: `Error: ${errorMessage}`,
        role: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorChatMessage])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle Enter key press to send message
   * Requirement 11.7: WHEN a user presses the Enter key, send the message
   * Shift+Enter should create new line (default behavior)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /**
   * Handle input change with character limit
   * Requirement 11.10: text input field SHALL have a maximum character limit (1000 characters)
   */
  const handleInputChange = (e) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setInputValue(value)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-600">Ask me about events and opportunities</p>
      </div>

      {/* Messages Container - Scrollable */}
      {/* Requirement 8.2: Chat_History section showing all messages */}
      {/* Requirement 8.5: Chat_History SHALL be scrollable and show most recent messages at bottom */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {/* Requirement 8.9: Display Loading_State indicator while waiting for AI_API response */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-xl rounded-bl-none shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {/* Requirement 8.6: message input area at the bottom with text input field and 'Send' button */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-md">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            rows="2"
            aria-label="Message input"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        {/* Character count indicator */}
        {/* Requirement 11.10: Display character count indicator */}
        <p className="text-xs text-gray-600 mt-2">
          {inputValue.length}/{MAX_CHARS}
        </p>
      </div>
    </div>
  )
}
