# Production Hardening Quick Reference

Quick reference for developers working with the hardened codebase.

## Common Patterns

### 1. Formatting Dates and Numbers

```javascript
import { formatDate, formatNumber, formatCurrency } from '../utils/formatting'

// Date formatting (uses user's locale)
const formattedDate = formatDate(event.event_date)
// Output: "Jan 15, 2024" (en-US) or "15 janv. 2024" (fr-FR)

// Number formatting
const formattedCount = formatNumber(1234567)
// Output: "1,234,567" (en-US) or "1.234.567" (de-DE)

// Currency formatting
const price = formatCurrency(99.99, 'MYR')
// Output: "RM99.99" (Malaysia)
```

### 2. Handling Long Text

```javascript
// In JSX - truncate to 2 lines
<h3 className="truncate-2 break-words-safe min-w-0" title={fullText}>
  {longText}
</h3>

// In JavaScript - truncate programmatically
import { truncateText } from '../utils/formatting'
const short = truncateText(longText, 100) // "Text... (truncated at 100 chars)"
```

### 3. Error Handling

```javascript
// API calls with proper error handling
try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: abortController.signal // For timeout
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait and try again.')
    } else if (response.status >= 500) {
      throw new Error('Server error. Please try again later.')
    } else if (response.status >= 400) {
      throw new Error('Invalid request. Please check your input.')
    }
  }

  const result = await response.json()
  return result
} catch (err) {
  if (err.name === 'AbortError') {
    throw new Error('Request timed out. Please try again.')
  } else if (err instanceof TypeError) {
    throw new Error('Network error. Please check your connection.')
  }
  throw err
}
```

### 4. Loading States

```javascript
// Use skeleton screens instead of spinners
import SkeletonCard from './SkeletonCard'

if (loading) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
  )
}

// Button loading state
<button disabled={loading} className="...">
  {loading ? (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Loading...
    </span>
  ) : (
    'Submit'
  )}
</button>
```

### 5. Empty States

```javascript
// Meaningful empty states with actions
if (items.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <SearchIcon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Items Found
      </h3>
      <p className="text-sm text-gray-600 max-w-sm mb-4">
        Try adjusting your filters or search terms.
      </p>
      <button onClick={handleClear} className="text-blue-600 hover:text-blue-700">
        Clear filters
      </button>
    </div>
  )
}
```

### 6. Form Validation

```javascript
// HTML5 validation with ARIA
<input
  type="text"
  id="business_name"
  name="business_name"
  value={formData.business_name}
  onChange={handleInputChange}
  maxLength={255}
  required
  aria-required="true"
  aria-invalid={errors.business_name ? 'true' : 'false'}
  aria-describedby={errors.business_name ? 'business_name-error' : undefined}
  className="w-full px-4 py-2 border rounded-md min-w-0"
/>
{errors.business_name && (
  <p id="business_name-error" className="mt-1 text-sm text-red-600" role="alert">
    {errors.business_name}
  </p>
)}
```

### 7. Preventing Double Submission

```javascript
const isSubmittingRef = useRef(false)

const handleSubmit = useCallback(async () => {
  // Guard against double submission
  if (isSubmittingRef.current) return
  
  isSubmittingRef.current = true
  setLoading(true)
  
  try {
    await submitData()
  } finally {
    setLoading(false)
    isSubmittingRef.current = false
  }
}, [])
```

### 8. Network Status Detection

```javascript
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

// Use in UI
{!isOnline && (
  <div className="bg-red-50 border-b border-red-200 p-3">
    <p className="text-sm text-red-800">You are offline</p>
  </div>
)}
```

### 9. Modal Accessibility

```javascript
// Modal with ESC key and focus management
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose()
    }
  }

  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden' // Prevent body scroll
  }

  return () => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = 'unset'
  }
}, [isOpen, onClose])

// Modal JSX
<div
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onClick={(e) => e.target === e.currentTarget && onClose()} // Close on backdrop click
>
  <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
    <h2 id="modal-title">Modal Title</h2>
    {/* Modal content */}
  </div>
</div>
```

### 10. Debouncing Search Input

```javascript
import { debounce } from '../utils/debounce'
import { useCallback } from 'react'

// Create debounced search function
const debouncedSearch = useCallback(
  debounce((query) => {
    performSearch(query)
  }, 300),
  []
)

// Use in input handler
const handleInputChange = (e) => {
  const value = e.target.value
  setSearchQuery(value)
  debouncedSearch(value) // Debounced API call
}
```

## CSS Utility Classes

### Text Truncation
```css
.truncate-1  /* Truncate to 1 line */
.truncate-2  /* Truncate to 2 lines */
.truncate-3  /* Truncate to 3 lines */
```

### Word Breaking
```css
.break-words-safe  /* Safe word breaking with hyphens */
```

### Prevent Overflow
```css
.min-w-0  /* Allow flex/grid items to shrink below content size */
.min-h-0  /* Allow flex/grid items to shrink below content size */
```

### Loading Skeleton
```css
.skeleton  /* Animated loading skeleton */
```

## Accessibility Checklist

When creating new components:

- [ ] Add proper ARIA labels (`aria-label`, `aria-labelledby`)
- [ ] Add `aria-describedby` for hints and errors
- [ ] Add `aria-invalid` for validation states
- [ ] Add `aria-live` for dynamic content
- [ ] Add `aria-busy` for loading states
- [ ] Ensure keyboard navigation works (Tab, Enter, ESC)
- [ ] Add `role` attributes where needed
- [ ] Ensure minimum 44px touch targets
- [ ] Test with keyboard only
- [ ] Test with screen reader

## Performance Checklist

When adding new features:

- [ ] Use `useCallback` for event handlers
- [ ] Use `useMemo` for expensive computations
- [ ] Add cleanup in `useEffect` (event listeners, timers)
- [ ] Debounce search inputs and scroll handlers
- [ ] Use `loading="lazy"` for images
- [ ] Implement skeleton screens for loading states
- [ ] Abort pending requests on unmount
- [ ] Prevent unnecessary re-renders

## Error Handling Checklist

When making API calls:

- [ ] Implement timeout with AbortController
- [ ] Handle specific HTTP status codes (429, 401, 500, etc.)
- [ ] Detect network errors (TypeError)
- [ ] Provide clear, actionable error messages
- [ ] Offer retry mechanism
- [ ] Log errors for monitoring
- [ ] Show error state in UI
- [ ] Don't lose user input on error

## Common Gotchas

### 1. Flex/Grid Overflow
Always add `min-w-0` to flex/grid items that contain text:
```jsx
<div className="flex">
  <div className="flex-1 min-w-0"> {/* min-w-0 is crucial */}
    <p className="truncate">{longText}</p>
  </div>
</div>
```

### 2. Date Formatting
Always use `formatDate()` utility instead of `toLocaleDateString()` directly:
```javascript
// ❌ Bad - doesn't handle invalid dates
const date = new Date(dateString).toLocaleDateString()

// ✅ Good - handles invalid dates and uses user's locale
const date = formatDate(dateString)
```

### 3. Missing Data
Always check for null/undefined before rendering:
```javascript
// ❌ Bad - crashes if event.city is undefined
<p>{event.city}, {event.state}</p>

// ✅ Good - handles missing data gracefully
{(event.city || event.state) && (
  <p>{event.city || ''}{event.city && event.state ? ', ' : ''}{event.state || ''}</p>
)}
```

### 4. Button States
Always disable buttons during async operations:
```javascript
// ❌ Bad - can be clicked multiple times
<button onClick={handleSubmit}>Submit</button>

// ✅ Good - prevents double submission
<button onClick={handleSubmit} disabled={loading} aria-busy={loading}>
  {loading ? 'Submitting...' : 'Submit'}
</button>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs - Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Intl API Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [React Hooks Best Practices](https://react.dev/reference/react)

## Questions?

Refer to `HARDENING_SUMMARY.md` for detailed explanations of all hardening improvements.
