import React, { useState } from 'react'
import EventDiscoveryPane from '../components/EventDiscoveryPane'
import ChatbotPane from '../components/ChatbotPane'
import { MessageSquare, Calendar } from 'lucide-react'

/**
 * EventDiscoveryComplete Page Component
 * 
 * Implements a responsive layout with:
 * - Mobile: Tabbed interface (Events / Chat)
 * - Tablet/Desktop: Split-screen layout (Events | Chat)
 * 
 * Layout specifications:
 * - Mobile (<1024px): Single pane with bottom tab navigation
 * - Desktop (≥1024px): CSS Grid with grid-cols-2 for 50/50 split
 * - Positioned below Navigation Bar
 * - Fills remaining vertical space (min-h-screen minus navbar height)
 * - Dark theme background
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 1.1, Responsive Design
 */
export default function EventDiscoveryComplete() {
  const [activeTab, setActiveTab] = useState('events') // 'events' or 'chat'

  return (
    <>
      {/* Desktop Layout: Side-by-side with wider left pane */}
      <div
        className="hidden lg:grid min-h-[calc(100vh-64px)]"
        style={{
          background: '#F8F7F5',
          gridTemplateColumns: '1fr 400px'
        }}
      >
        {/* Left Pane - Event Discovery */}
        <EventDiscoveryPane />

        {/* Right Pane - AI Chatbot */}
        <ChatbotPane />
      </div>

      {/* Mobile/Tablet Layout: Tabbed Interface */}
      <div
        className="lg:hidden flex flex-col min-h-[calc(100vh-64px)]"
        style={{ background: '#F8F7F5' }}
      >
        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {/* Events Tab Content */}
          <div className={`h-full ${activeTab === 'events' ? 'block' : 'hidden'}`}>
            <EventDiscoveryPane />
          </div>

          {/* Chat Tab Content */}
          <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
            <ChatbotPane />
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <nav 
          className="sticky bottom-0 border-t safe-area-inset-bottom"
          style={{
            background: 'oklch(99% 0.005 85)',
            borderColor: 'oklch(90% 0.01 85)'
          }}
        >
          <div className="grid grid-cols-2">
            {/* Events Tab */}
            <button
              onClick={() => setActiveTab('events')}
              className="flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200 font-semibold"
              style={{
                color: activeTab === 'events' ? 'oklch(25% 0.015 15)' : 'oklch(65% 0.01 15)',
                background: activeTab === 'events' ? 'oklch(96% 0.008 85)' : 'transparent'
              }}
              aria-label="View events"
              aria-current={activeTab === 'events' ? 'page' : undefined}
            >
              <Calendar size={24} className="mb-1" />
              <span className="text-xs">Events</span>
            </button>

            {/* Chat Tab */}
            <button
              onClick={() => setActiveTab('chat')}
              className="flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200 font-semibold"
              style={{
                color: activeTab === 'chat' ? 'oklch(25% 0.015 15)' : 'oklch(65% 0.01 15)',
                background: activeTab === 'chat' ? 'oklch(96% 0.008 85)' : 'transparent'
              }}
              aria-label="Open chat"
              aria-current={activeTab === 'chat' ? 'page' : undefined}
            >
              <MessageSquare size={24} className="mb-1" />
              <span className="text-xs">Chat</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
