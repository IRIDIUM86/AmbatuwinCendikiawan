# Typography System

## Design Principles

**Hierarchy through scale + weight contrast**: Each level has ≥1.25 ratio to the next, with weight changes reinforcing the hierarchy.

**Clarity over cleverness**: Information must be scannable. Vendors and organizers need to evaluate quickly.

**Professional reliability**: Typography communicates stability and dependability, not experimentation.

## Type Scale

Based on a 1.25 ratio (major third) for clear hierarchy:

| Level | Size | Weight | Line Height | Letter Spacing | Use Case |
|-------|------|--------|-------------|----------------|----------|
| **Display** | 2.25rem (36px) | extrabold (800) | tight (1.25) | tight (-0.025em) | Page titles |
| **H1** | 1.75rem (28px) | extrabold (800) | tight (1.25) | tight (-0.025em) | Modal titles, section headers |
| **H2** | 1.375rem (22px) | extrabold (800) | tight (1.25) | tight (-0.025em) | Brand/logo, subsection headers |
| **H3** | 1.125rem (18px) | bold (700) | snug (1.375) | tight (-0.015em) | Card titles, list headers |
| **Body** | 1rem (16px) | normal (400) | relaxed (1.625) | normal (0) | Paragraph text, descriptions |
| **Small** | 0.875rem (14px) | normal (400) | relaxed (1.625) | normal (0) | Metadata, secondary info |
| **Label** | 0.8125rem (13px) | bold (700) | normal (1.5) | wide (0.05em) | Form labels, section labels (uppercase) |
| **Caption** | 0.75rem (12px) | normal (400) | normal (1.5) | normal (0) | Badges, hints, fine print |

## Weight Hierarchy

- **extrabold (800)**: Display, H1, H2 - Maximum authority
- **bold (700)**: H3, labels, emphasis - Strong hierarchy
- **semibold (600)**: Navigation, buttons, subheadings - Medium emphasis
- **normal (400)**: Body text, descriptions - Readable default

## Line Height Strategy

- **tight (1.25)**: Large headings - Compact, impactful
- **snug (1.375)**: Medium headings - Balanced
- **normal (1.5)**: Small text, UI elements - Standard spacing
- **relaxed (1.625)**: Body text, descriptions - Comfortable reading

## Letter Spacing (Tracking)

- **tight (-0.025em to -0.015em)**: Large headings - Tighter for visual cohesion
- **normal (0)**: Body text - Default spacing
- **wide (0.05em)**: Uppercase labels - Improved legibility

## Implementation Examples

### Headings

```jsx
// Page title
<h1 className="text-[2.25rem] font-extrabold leading-tight tracking-tight">

// Modal title
<h2 className="text-[1.75rem] font-extrabold leading-tight tracking-tight">

// Brand/logo
<div className="text-[1.375rem] font-extrabold leading-none tracking-tight">

// Card title
<h3 className="text-[1.125rem] font-bold leading-snug tracking-tight">
```

### Body Text

```jsx
// Paragraph
<p className="text-[1rem] leading-relaxed">

// Secondary info
<p className="text-[0.875rem] leading-relaxed">

// Description
<p className="text-[0.875rem] text-[oklch(0.40_0.01_20)] leading-relaxed">
```

### UI Elements

```jsx
// Navigation link
<a className="text-[0.9375rem] font-semibold">

// Button text
<button className="text-[0.9375rem] font-semibold">

// Form label
<label className="text-[0.8125rem] font-bold leading-normal tracking-wide uppercase">

// Badge
<span className="text-[0.75rem] leading-normal">

// Hint text
<p className="text-[0.75rem] text-[oklch(0.50_0.01_20)] leading-normal">
```

## Responsive Considerations

**Mobile (vendors):**
- Maintain hierarchy but optimize for thumb-friendly tap targets
- Minimum 44px touch targets for interactive elements
- Slightly larger body text (1rem minimum) for readability on small screens

**Desktop (organizers):**
- Information-dense layouts benefit from the full scale
- Tighter line-height acceptable for headings
- More content visible without scrolling

## Accessibility

- Minimum 16px (1rem) for body text
- Sufficient contrast ratios maintained across all sizes
- Line length capped at 65-75ch for optimal readability
- Letter spacing aids legibility for uppercase labels

## Anti-patterns to Avoid

❌ Flat scales (text-sm, text-base, text-lg) - insufficient contrast
❌ Only using font-weight for hierarchy - needs size variation too
❌ Inconsistent line-height - creates visual chaos
❌ Gradient text - decorative, not meaningful
❌ Overly tight tracking on body text - reduces readability

## Migration Notes

**Before:**
- Generic Tailwind sizes (text-sm, text-lg, text-xl)
- Only font-bold and font-medium
- No letter-spacing consideration
- Inconsistent line-height

**After:**
- Precise rem-based scale with 1.25 ratio
- Full weight range (extrabold to normal)
- Strategic letter-spacing for headings and labels
- Consistent, purposeful line-height

This creates a professional, scannable interface that serves the business tool context while maintaining excellent readability across devices.
