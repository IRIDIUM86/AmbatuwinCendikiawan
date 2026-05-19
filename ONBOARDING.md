# Onboarding Strategy

## Overview

The Food Vendor Event Matching System uses **contextual, progressive onboarding** designed for professional event organizers who value efficiency over hand-holding.

## Design Philosophy

### Time to Value: < 30 seconds
Event organizers are time-pressed professionals. Our onboarding gets them to their "aha moment" (seeing AI match vendors to events) in under 30 seconds.

### Show, Don't Tell
- Welcome message demonstrates AI capabilities with real examples
- Empty states guide next actions
- Quick actions teach by doing

### Respect Intelligence
- No forced tutorials or multi-step wizards
- All guidance is dismissible
- Contextual help appears when needed, not upfront

## Onboarding Touchpoints

### 1. First Chat Message (Immediate Value)
**Location**: ChatbotPane initial message  
**Timing**: Loads with page  
**Purpose**: Demonstrate AI capabilities immediately

```
Hello! I'm your AI matching assistant. I can help you find events 
that match specific vendor requirements.

Try asking me:
• "Show me weekend events in Jakarta under 3M budget"
• "What events have parking and electricity?"
• "Find bazaars in June with high foot traffic"
```

**Why it works**:
- Shows what the AI can do (not just "I'm here to help")
- Provides concrete examples users can copy
- Natural language examples (not technical queries)

### 2. Welcome Tooltip (Optional Guidance)
**Location**: Chat header  
**Timing**: 800ms after page load (first visit only)  
**Storage**: `localStorage: chat-welcome-seen`

**Content**:
- Title: "💬 AI-Powered Matching"
- Message: "Ask me natural questions like 'Find weekend events in Jakarta under 3M' and I'll search and match events for you instantly."

**Why it works**:
- Appears after user has oriented themselves
- Dismissible (respects user control)
- Never shows again (tracked in localStorage)
- Positioned near relevant UI (chat header)

### 3. Empty State (Contextual Help)
**Location**: EventDiscoveryPane when no events  
**Timing**: When event list is empty

**Two variants**:

**A. No events in system**:
```
📅 No events available

Events will appear here once they're added to the system. 
In the meantime, try asking the AI assistant about vendor 
requirements or event planning.

💡 Tip: Use the AI chat to search for specific event types, 
locations, or budget ranges
```

**B. Filtered out all events**:
```
📅 No matching events

Try adjusting your filters or ask the AI assistant to help 
you find events that match your criteria.

[Clear Filters]

💡 Tip: Use the AI chat to search for specific event types, 
locations, or budget ranges
```

**Why it works**:
- Explains what will appear (not just "nothing here")
- Provides clear next action
- Connects to AI feature (cross-feature discovery)
- Contextual tip teaches alternative approach

## What We Don't Do

### ❌ No Forced Tutorials
Event organizers don't need step-by-step walkthroughs. The interface is self-explanatory with contextual hints.

### ❌ No Welcome Modals
Blocking modals delay time-to-value. Users can start using the tool immediately.

### ❌ No Feature Tours
The split-screen layout is familiar (chat + content). No tour needed.

### ❌ No Repeated Tooltips
Once dismissed, tooltips never reappear. We respect user decisions.

### ❌ No Patronizing Copy
Professional users don't need "Yay! You did it!" celebrations. Clear, direct language only.

## Success Metrics

### Primary Metrics
- **Time to first AI query**: < 30 seconds
- **AI feature discovery rate**: > 80% of users try chat within first session
- **Tooltip dismiss rate**: < 20% (if higher, tooltip is annoying)

### Secondary Metrics
- **Empty state engagement**: % of users who click "Clear Filters" or try AI chat
- **Return user experience**: No onboarding shown on return visits

## Future Enhancements

### Phase 2: Contextual Feature Discovery
- Tooltip on first filter use: "💡 Filters work great with AI chat"
- Badge on event cards: "New" indicator for recently added events
- Keyboard shortcut hints: Show `⌘K` or `Ctrl+K` for quick chat access

### Phase 3: Progressive Complexity
- Advanced search tips after 5+ queries
- Bulk actions tutorial after managing 10+ events
- Export/reporting features unlocked after first successful match

## Implementation Notes

### Storage Keys
```javascript
// Tooltip tracking
localStorage.setItem('chat-welcome-seen', 'true')

// Future feature discovery
localStorage.setItem('filter-tooltip-seen', 'true')
localStorage.setItem('keyboard-shortcut-shown', 'true')
```

### Component Structure
```
WelcomeTooltip.js
├── Dismissible tooltip component
├── localStorage tracking
├── Configurable position
└── Auto-show with delay

EventDiscoveryPane.js
├── Enhanced empty states
├── Contextual guidance
└── Cross-feature discovery

ChatbotPane.js
├── Example-driven welcome message
├── WelcomeTooltip integration
└── Natural language examples
```

## Design Principles Applied

### 1. Clarity over cleverness
Empty states explain what will appear and why it matters. No clever copy that obscures meaning.

### 2. Earned trust through precision
Examples use real data formats (Jakarta, 3M budget) that match actual use cases.

### 3. Information density without clutter
Tooltips appear once, then disappear forever. No persistent badges or indicators.

### 4. Professional without being boring
Emoji used sparingly for visual interest (📅, 💡, 💬) but copy remains professional.

## Accessibility

- **Keyboard navigation**: All tooltips dismissible with ESC
- **Screen readers**: `role="tooltip"` and `aria-live="polite"` on dynamic content
- **Focus management**: Tooltips don't trap focus
- **Color independence**: Guidance never relies on color alone

## Testing Checklist

- [ ] First-time user sees welcome tooltip
- [ ] Tooltip dismisses and never reappears
- [ ] Empty state shows appropriate message
- [ ] Clear Filters button works
- [ ] AI examples are copy-pasteable
- [ ] Tooltip doesn't block critical UI
- [ ] Works on mobile (tooltip repositions)
- [ ] localStorage persists across sessions
- [ ] Keyboard shortcuts work (ESC to dismiss)
- [ ] Screen reader announces tooltip content
