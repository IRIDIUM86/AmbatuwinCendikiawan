import React from 'react'
import EventDiscoveryPane from '../components/EventDiscoveryPane'
import ChatbotPane from '../components/ChatbotPane'

/**
 * EventDiscoveryComplete Page Component
 * 
 * Implements a split-screen layout with:
 * - Left pane: Event Discovery interface
 * - Right pane: AI Chatbot interface
 * 
 * Layout specifications:
 * - CSS Grid with grid-cols-2 for 50/50 split
 * - Positioned below Navigation Bar
 * - Fills remaining vertical space (min-h-screen minus navbar height)
 * - Premium light mode background (bg-gray-50)
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 1.1
 */
export default function EventDiscoveryComplete() {
  /**
   * Handle AI message sending
   * Placeholder for AI API integration
   */
  const handleSendMessage = async (message) => {
    try {
      // TODO: Integrate with AI API
      // For now, return a simple response
      return `I received your message: "${message}". This is a placeholder response. AI integration coming soon!`
    } catch (err) {
      throw new Error('Failed to process message')
    }
  }

  return (
    <div className="grid grid-cols-2 min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Left Pane - Event Discovery */}
      <EventDiscoveryPane />

      {/* Right Pane - AI Chatbot */}
      <ChatbotPane onSendMessage={handleSendMessage} />
    </div>
  )
}
