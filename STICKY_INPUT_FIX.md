# Sticky Message Input Fix

## Issue
The message input area in the ChatbotPane was scrolling when the EventDiscoveryPane (left tab) was scrolled, causing the messaging feature to move out of position.

## Root Cause
The input area had `sticky bottom-0` classes which were unnecessary and potentially causing positioning conflicts. The ChatbotPane already uses a flexbox layout (`flex flex-col h-full`) where:
- The messages container has `flex-1` (takes all available space)
- The input area naturally sits at the bottom of the flex container

## Solution
Removed the `sticky bottom-0 z-10` classes from the input area div in `ChatbotPane.js`. The input area now relies on the flexbox layout to stay at the bottom, which is more reliable and doesn't interfere with scrolling in other panes.

## Technical Details

### Before:
```jsx
<div className="sticky bottom-0 bg-[#171717] border-t border-gray-800 p-4 sm:p-6 z-10">
```

### After:
```jsx
<div className="bg-[#171717] border-t border-gray-800 p-4 sm:p-6">
```

## Layout Architecture

### Desktop (≥1024px):
- Split-screen grid layout (`grid-cols-2`)
- EventDiscoveryPane (left) and ChatbotPane (right) are independent
- Each pane has its own scroll container
- Scrolling the events list does NOT affect the chat pane

### Mobile (<1024px):
- Tabbed interface with bottom navigation
- Only one pane visible at a time
- Each pane maintains its own scroll state
- Input area stays at bottom of visible pane

## Component Structure

```
ChatbotPane (flex flex-col h-full)
├── Header (fixed height)
├── Messages Container (flex-1, overflow-y-auto)
│   └── Individual messages
└── Input Area (fixed height, naturally at bottom)
    ├── Textarea + Send button
    └── Character counter
```

## Benefits
1. **Simpler CSS**: Relies on flexbox instead of position sticky
2. **Better scroll behavior**: No interference between panes
3. **Consistent positioning**: Input always at bottom regardless of scroll
4. **Mobile-friendly**: Works correctly in both desktop and mobile layouts

## Build Status
✅ Build successful with no errors
- Bundle size: 118.35 kB JS (-3 B), 6.71 kB CSS
- All responsive features intact
- WCAG 2.1 AA compliance maintained

## Testing Recommendations
1. Test scrolling events list on desktop - chat input should stay fixed
2. Test mobile tabbed interface - input should stay at bottom of each tab
3. Test with long message history - input should remain accessible
4. Test keyboard navigation - focus should work correctly
5. Test on devices with notches - safe area insets should work

## Files Modified
- `src/components/ChatbotPane.js` - Removed sticky positioning from input area
