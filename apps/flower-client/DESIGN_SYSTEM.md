# Design System Documentation

## Overview

This project uses an enterprise-scale design system architecture with design tokens, CSS custom properties, and component variants.

## Architecture

```
src/
├── styles/
│   ├── tokens/              # TypeScript design tokens (single source of truth)
│   │   ├── colors.tokens.ts
│   │   ├── spacing.tokens.ts
│   │   ├── typography.tokens.ts
│   │   ├── shadows.tokens.ts
│   │   └── index.ts
│   ├── theme.css            # CSS custom properties (runtime theming)
│   ├── _theme.scss          # Legacy theme (for backward compatibility)
│   └── components.scss     # Component utilities
└── app/
    └── shared/
        └── ui/
            └── components/  # Reusable UI components
```

## Design Tokens

### Colors

**Location:** `src/styles/tokens/colors.tokens.ts`

```typescript
import { Colors } from '@/styles/tokens';

// Primary colors
Colors.primary[500]  // #e91e63
Colors.primary[600]  // #c2185b

// Semantic colors
Colors.semantic.success  // #10b981
Colors.semantic.error     // #ef4444

// KPI colors
Colors.kpi.blue    // #3b82f6
Colors.kpi.purple  // #a855f7
```

### Spacing

**Location:** `src/styles/tokens/spacing.tokens.ts`

```typescript
import { Spacing } from '@/styles/tokens';

Spacing.xs   // 0.25rem (4px)
Spacing.sm   // 0.5rem (8px)
Spacing.md   // 1rem (16px)
Spacing.lg   // 1.5rem (24px)
Spacing.xl   // 2rem (32px)
```

### Typography

**Location:** `src/styles/tokens/typography.tokens.ts`

```typescript
import { Typography } from '@/styles/tokens';

Typography.fontSize.xs      // 0.75rem
Typography.fontWeight.bold  // 700
Typography.lineHeight.tight // 1.25
```

## CSS Custom Properties

All tokens are available as CSS custom properties in `theme.css`:

```css
/* Colors */
--color-primary-500: #e91e63;
--color-success: #10b981;

/* Spacing */
--spacing-md: 1rem;
--spacing-lg: 1.5rem;

/* Typography */
--text-base: 1rem;
--font-weight-bold: 700;

/* Shadows */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

**Usage in CSS:**
```css
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-lg);
  font-size: var(--text-base);
  box-shadow: var(--shadow-md);
}
```

## Component Variants

### Card Component

**Location:** `src/app/shared/ui/components/card/`

```typescript
// Variants
type CardVariant = 'default' | 'highlight' | 'interactive';

// Padding options
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
```

**Usage:**
```html
<app-card 
  variant="highlight" 
  padding="lg"
  [interactive]="true"
  title="Card Title"
  subtitle="Card subtitle">
  Content here
</app-card>
```

## Shared Utilities

### Dashboard Container
```html
<div class="dashboard-container">
  <!-- Content -->
</div>
```

### Stats Grid
```html
<div class="stats-grid">
  <!-- Stat cards -->
</div>
```

### Chart Grid
```html
<div class="chart-grid">
  <!-- Charts -->
</div>
```

### State Utilities
```html
<!-- Loading -->
<div class="loading-state">
  <div class="spinner"></div>
  <p>Loading...</p>
</div>

<!-- Error -->
<div class="error-state">
  <p>Error message</p>
</div>

<!-- Empty -->
<div class="empty-state">
  <p>No data available</p>
</div>
```

## Best Practices

### ✅ DO

- Use design tokens for ALL values
- Use CSS custom properties in component styles
- Create variant-based components
- Compose small, focused components
- Document component APIs

### ❌ DON'T

- Hardcode colors/spacing in templates
- Use arbitrary values like `p-[13px]`
- Create mega-components
- Mix utility classes with component styles
- Override component styles from parent

## Migration Guide

When updating styles:

1. **Update tokens** → Changes propagate everywhere
2. **Update component variants** → Contained change
3. **Update theme CSS variables** → Runtime changes

**Example: Changing primary color**

```typescript
// BEFORE: Change in 50 places 😱
<button class="bg-blue-600">Click</button>

// AFTER: Change once in tokens 🎉
// src/styles/tokens/colors.tokens.ts
export const Colors = {
  primary: {
    500: '#8b5cf6',  // Changed from pink to purple
  }
}
```

## Theme Switching

The design system supports dark theme via `data-theme` attribute:

```typescript
// Switch to dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Switch to light theme
document.documentElement.setAttribute('data-theme', 'light');
```

## Component Documentation

Each component should include:
- Props/Inputs documentation
- Variant options
- Usage examples
- Accessibility considerations

## Testing

Component styles can be tested:

```typescript
it('should apply correct variant class', () => {
  component.variant = 'highlight';
  expect(component.cardClasses).toContain('card-highlight');
});
```

## Version History

- **v2.0.0** - Enterprise design system architecture
- **v1.0.0** - Initial design system

