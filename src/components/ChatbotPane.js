import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import apiService from '../services/apiService'
import WelcomeTooltip from './WelcomeTooltip'

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
      text: 'Hello! I\'m your AI matching assistant. I can help you find events that match specific vendor requirements.\n\nTry asking me:\n\n• "Show me weekend events in Kuala Lumpur under 500 RM"\n\n• "What events have parking and electricity?"\n\n• "Find bazaars in June with high foot traffic"',
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
   * Parse markdown bold syntax (**text**) and return JSX elements
   */
  const parseMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return <strong key={index}>{boldText}</strong>
      }
      return part
    })
  }

  /**
   * Auto-scroll to bottom when new messages arrive
   * Requirement 8.5: Chat_History SHALL automatically scroll to show the most recent message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  }, [messages, loading])

  /**
   * Call AI API with error handling
   * Requirement 9.1-9.8: Handle various error scenarios
   */
  const callAIAPI = async (userMessage) => {
    try {
      // Build conversation history from messages state
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))

      // Call backend API
      const response = await apiService.sendChatMessage(
        userMessage,
        conversationHistory
      )

      // Check response format
      if (!response.success) {
        throw new Error(response.error || 'Failed to get AI response')
      }

      // Return the AI response text
      return response.response || response.message || 'No response from AI'
      
    } catch (error) {
      console.error('Chat API Error:', error)
      throw error
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
    <div 
      className="flex flex-col h-full border-l"
      style={{
        background: 'oklch(98% 0.006 85)',
        borderColor: 'oklch(90% 0.01 85)'
      }}
    >
      {/* Chat Header */}
      <div 
        className="border-b p-5 sm:p-6 relative"
        style={{
          background: 'oklch(99% 0.005 85)',
          borderColor: 'oklch(90% 0.01 85)'
        }}
      >
        <h2 
          className="text-base sm:text-lg font-bold"
          style={{ 
            color: 'oklch(25% 0.015 15)',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          AI Matching Assistant
        </h2>
        <p 
          className="text-xs sm:text-sm font-medium"
          style={{ 
            color: 'oklch(45% 0.02 15)',
            letterSpacing: '-0.01em'
          }}
        >
          Find events that match your vendor needs
        </p>

        {/* Welcome tooltip for first-time users */}
        <WelcomeTooltip
          storageKey="chat-welcome-seen"
          title="💬 AI-Powered Matching"
          message="Ask me natural questions like 'Find weekend events in Jakarta under 3M' and I'll search and match events for you instantly."
          position="bottom"
        />
      </div>

      {/* Messages Container - Scrollable */}
      {/* Requirement 8.2: Chat_History section showing all messages */}
      {/* Requirement 8.5: Chat_History SHALL be scrollable and show most recent messages at bottom */}
      <div 
        className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat message history"
      >
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                message.role === 'user'
                  ? 'rounded-br-sm'
                  : 'rounded-bl-sm'
              }`}
              style={message.role === 'user' ? {
                background: 'oklch(45% 0.15 25)',
                color: 'oklch(99% 0.005 85)',
                boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.2)'
              } : {
                background: 'oklch(99% 0.005 85)',
                color: 'oklch(25% 0.015 15)',
                border: '1.5px solid oklch(90% 0.01 85)',
                boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06)'
              }}
            >
              <p 
                className="text-sm leading-relaxed font-medium"
                style={{ letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}
              >
                {parseMarkdown(message.text)}
              </p>
              <p 
                className="text-xs mt-1.5 font-medium"
                style={{ 
                  color: message.role === 'user' 
                    ? 'oklch(85% 0.08 25)' 
                    : 'oklch(65% 0.01 15)',
                  letterSpacing: '-0.01em'
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {/* Requirement 8.9: Display Loading_State indicator while waiting for AI_API response */}
        {loading && (
          <div className="flex justify-start">
            <div 
              className="px-4 py-3 rounded-xl rounded-bl-sm"
              style={{
                background: 'oklch(99% 0.005 85)',
                border: '1.5px solid oklch(90% 0.01 85)',
                boxShadow: '0 1px 3px oklch(0% 0 0 / 0.06)'
              }}
            >
              <div className="flex space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'oklch(45% 0.15 25)' }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    background: 'oklch(55% 0.18 35)',
                    animationDelay: '0.1s'
                  }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ 
                    background: 'oklch(45% 0.15 25)',
                    animationDelay: '0.2s'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Larger touch targets */}
      {/* Requirement 8.6: message input area at the bottom with text input field and 'Send' button */}
      <div 
        className="sticky bottom-0 z-10 p-5 sm:p-6"
        style={{
          background: 'oklch(99% 0.005 85)'
        }}
      >
        <div className="flex gap-2 sm:gap-3">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask about events, locations, or budgets..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl text-sm sm:text-base outline-none resize-none font-medium transition-all duration-200"
            style={{
              background: 'oklch(99% 0.005 85)',
              border: '2px solid oklch(88% 0.01 85)',
              color: 'oklch(25% 0.015 15)',
              letterSpacing: '-0.01em'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'oklch(45% 0.15 25)'
              e.target.style.boxShadow = '0 0 0 3px oklch(45% 0.15 25 / 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'oklch(88% 0.01 85)'
              e.target.style.boxShadow = 'none'
            }}
            rows="1"
            aria-label="Message input"
            aria-describedby="char-count"
            maxLength={MAX_CHARS}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] p-3 rounded-xl transition-all duration-200 flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            style={{
              background: 'oklch(45% 0.15 25)',
              color: 'oklch(99% 0.005 85)',
              boxShadow: '0 2px 8px oklch(45% 0.15 25 / 0.25)'
            }}
            onMouseEnter={(e) => {
              if (!loading && inputValue.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 16px oklch(45% 0.15 25 / 0.35)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px oklch(45% 0.15 25 / 0.25)'
            }}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        {/* Character count indicator */}
        {/* Requirement 11.10: Display character count indicator */}
        <p 
          id="char-count" 
          className="text-xs mt-2 font-semibold" 
          style={{ 
            color: 'oklch(65% 0.01 15)',
            letterSpacing: '-0.01em'
          }}
          aria-live="polite"
        >
          {inputValue.length}/{MAX_CHARS} characters
        </p>
      </div>
    </div>
  )
}
