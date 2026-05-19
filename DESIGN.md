# Design System

## Theme

**Light mode as primary experience.** Event organizers work in lit offices during business hours. The interface uses a warm, tinted neutral palette with a distinctive terracotta accent that feels professional and grounded—not generic tech purple.

## Color Palette

### Primary Colors
- **Terracotta**: `oklch(45% 0.15 25)` - Primary actions, accents, brand moments
- **Deep Terracotta**: `oklch(35% 0.12 15)` - Darker variant for depth
- **Warm Terracotta**: `oklch(55% 0.18 35)` - Lighter variant for gradients

### Neutrals (Warm-Tinted)
- **Background**: `oklch(97% 0.008 85)` - Page background
- **Surface**: `oklch(99% 0.005 85)` - Cards, containers
- **Surface Alt**: `oklch(96% 0.008 85)` - Status bars, secondary surfaces
- **Border Light**: `oklch(90% 0.01 85)` - Subtle borders
- **Border**: `oklch(88% 0.01 85)` - Input borders
- **Border Strong**: `oklch(82% 0.015 85)` - Emphasized borders

### Text Colors
- **Primary**: `oklch(25% 0.015 15)` - Headings, primary text
- **Secondary**: `oklch(35% 0.02 15)` - Body text, labels
- **Tertiary**: `oklch(45% 0.02 15)` - Supporting text
- **Muted**: `oklch(65% 0.01 15)` - Placeholders, disabled

### Semantic Colors
- **Success**: `oklch(55% 0.18 145)` - Connected states, success messages
- **Success Light**: `oklch(75% 0.12 145)` - Success borders
- **Error**: `oklch(35% 0.08 25)` - Error text
- **Error Background**: `oklch(95% 0.05 25)` - Error surfaces
- **Error Border**: `oklch(85% 0.06 25)` - Error borders

### Strategy
**Restrained with committed moments.** The interface uses tinted neutrals as the foundation (warm beige-grays, not pure grays). Terracotta accent appears on primary actions, status indicators, and the header accent stripe—roughly 15-20% of the surface. This creates professional confidence without overwhelming the workspace.

## Typography

### Font Families
- **Headings**: `'Space Grotesk', 'Inter', sans-serif` - Geometric, confident, distinctive
- **Body/UI**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` - Readable, professional, cross-platform

### Type Scale
- **H1 (Page Title)**: 32px / 700 / -0.02em tracking / 1.2 line-height
- **Body**: 15px / 500 / -0.01em tracking / 1.6 line-height
- **UI Labels**: 13px / 600 / -0.01em tracking
- **Status Text**: 13px / 600 / -0.01em tracking

### Hierarchy
Strong weight contrast (700 for headings, 500-600 for body) creates clear hierarchy without exaggerated scale jumps. Tight letter-spacing (-0.01em to -0.02em) gives a modern, confident feel appropriate for professional tools.

## Layout

### Spacing Scale
- **Micro**: 8px, 10px - Icon gaps, small spacing
- **Small**: 12px, 16px - Component padding, element gaps
- **Medium**: 20px, 24px, 32px - Section padding, message spacing
- **Large**: 40px, 48px - Container padding, major sections

### Container
- **Max Width**: 920px (wider than typical chat, accommodates information density)
- **Border Radius**: 12-16px (modern but not overly rounded)
- **Elevation**: Subtle shadows with OKLCH transparency for depth

### Grid
Flexible single-column chat layout with generous horizontal padding (40px) that creates breathing room without wasting space.

## Components

### Message Bubbles
- **Bot**: White surface with subtle border, left-aligned
- **User**: Terracotta background, right-aligned
- **Avatar**: 44px rounded squares (12px radius) with gradient or neutral fill
- **Padding**: 16px vertical, 20px horizontal
- **Max Width**: 65% of container

### Buttons
- **Primary**: Terracotta background, white text, 700 weight
- **Quick Actions**: Neutral background, hover transforms to terracotta
- **Border Radius**: 10-12px
- **Padding**: 10-18px (quick actions), 16-32px (primary)

### Inputs
- **Border**: 2px solid neutral, transitions to terracotta on focus
- **Focus Ring**: 3px terracotta with 10% opacity
- **Border Radius**: 12px
- **Padding**: 16px vertical, 20px horizontal

### Status Indicators
- **Dot**: 10px circle with 2px border
- **Connected**: Success green with subtle pulse animation
- **Disconnected**: Neutral gray

## Motion

### Timing
- **Fast**: 0.2s - Hovers, focus states
- **Standard**: 0.3-0.4s - Entrances, transitions
- **Slow**: 1.4s - Typing indicator loop, pulse animation

### Easing
- **Primary**: `cubic-bezier(0.16, 1, 0.3, 1)` - Smooth, confident ease-out
- **Ease In-Out**: For looping animations (typing, pulse)

### Animations
- **Slide In**: Messages enter with 16px translateY and fade
- **Pulse**: Status dot scales 1.0 to 1.1 with opacity fade
- **Typing**: Dots translate -12px with opacity change
- **Hover Lift**: Buttons lift 1px on hover

## Elevation

### Shadow System
- **Low**: `0 1px 3px oklch(0% 0 0 / 0.06)` - Subtle depth
- **Medium**: `0 1px 3px oklch(0% 0 0 / 0.08), 0 24px 80px oklch(0% 0 0 / 0.12)` - Container
- **Interactive**: `0 2px 8px oklch(45% 0.15 25 / 0.2-0.35)` - Buttons, avatars

Shadows use OKLCH black with low opacity for natural, color-aware depth.

## Accessibility

- **WCAG AA Compliance**: All text meets contrast requirements
- **Focus Indicators**: 3px rings with 10% opacity on interactive elements
- **Keyboard Navigation**: Full support for tab navigation
- **Motion**: Animations use reasonable durations (no bounce/elastic)
- **Color Independence**: Status never relies on color alone (text + icon + dot)

## Design Principles Applied

1. **Clarity over cleverness**: Clean hierarchy, readable type, obvious affordances
2. **Earned trust through precision**: Consistent spacing, aligned elements, thoughtful details
3. **Light mode as default**: Optimized for daytime office use with warm tints
4. **Information density without clutter**: 65% message width, generous padding, clear grouping
5. **Professional without being boring**: Distinctive terracotta accent, custom typography, subtle motion

## Anti-Patterns Avoided

- ❌ Generic purple gradients (used distinctive terracotta instead)
- ❌ Dark mode tech aesthetic (light mode optimized for offices)
- ❌ Overly rounded corners (12px, not 24px+)
- ❌ Glassmorphism effects (solid surfaces with subtle borders)
- ❌ Gradient text (solid colors only)
- ❌ Side-stripe borders (full borders or none)
