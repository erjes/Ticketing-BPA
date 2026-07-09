---
name: Institutional Efficiency
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b403d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#8f6f6c'
  outline-variant: '#e4beba'
  surface-tint: '#ba1a20'
  primary: '#af101a'
  on-primary: '#ffffff'
  primary-container: '#d32f2f'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ffb3ac'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#4d5960'
  on-tertiary: '#ffffff'
  tertiary-container: '#657279'
  on-tertiary-container: '#eaf7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930010'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d7e4ec'
  tertiary-fixed-dim: '#bbc8d0'
  on-tertiary-fixed: '#111d23'
  on-tertiary-fixed-variant: '#3c494f'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for high-utility administrative environments. It prioritizes clarity, speed of recognition, and institutional trust. The aesthetic is **Modern Corporate Minimalism**, stripping away decorative elements to focus entirely on task completion and data legibility. 

The emotional response should be one of reliability and order. By utilizing generous whitespace and a rigid structural grid, the system reduces the cognitive load associated with complex ticketing workflows. The visual language conveys authority without being overbearing, ensuring that government employees and service seekers feel the platform is both professional and accessible.

## Colors

The palette is anchored by **Corporate Red (#D32F2F)**, used strategically for primary actions, branding accents, and critical status indicators. To maintain a professional atmosphere, this high-energy red is balanced against a sophisticated range of architectural grays and stark whites.

- **Primary:** Corporate Red is reserved for the most important interactive elements (Primary Buttons, Active States).
- **Secondary:** Light Gray (#F5F5F5) defines the "Canvas" and "Surface" layers to separate content zones without heavy borders.
- **Tertiary:** Deep Slate (#263238) provides high-contrast grounding for sidebars and header navigation.
- **Status Tones:** Success (Emerald), Warning (Amber), and Info (Azure) are utilized in muted saturations to ensure they do not compete with the primary Brand Red.

## Typography

The design system employs **Public Sans**, an institutional typeface designed for accessibility and clarity. It provides a neutral, yet strong presence that excels in data-dense environments like ticketing queues and administrative forms.

For technical identifiers (Ticket IDs, Transaction Codes), **JetBrains Mono** is used to ensure individual characters are unmistakable. Hierarchy is established primarily through weight (SemiBold for headers) and subtle scale shifts rather than color, maintaining high accessibility standards.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop to ensure data tables and forms maintain optimal line lengths for readability. 

- **Desktop (12 columns):** 1440px max-width, 24px gutters, 40px side margins.
- **Tablet (8 columns):** Fluid width, 16px gutters, 24px side margins.
- **Mobile (4 columns):** Fluid width, 16px gutters, 16px side margins.

A strict 4px/8px baseline grid is used for all internal component spacing to ensure mathematical harmony across the interface.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** instead of heavy shadows to define depth. This reinforces the "flat" professional aesthetic while maintaining clear object separation.

- **Level 0 (Background):** #F5F5F5. The base application surface.
- **Level 1 (Cards/Tables):** White (#FFFFFF) with a 1px solid border (#E0E0E0). No shadow.
- **Level 2 (Dropdowns/Modals):** White (#FFFFFF) with a very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) and a 1px border (#D1D1D1).
- **Interactive States:** Hovering over a card or list item triggers a subtle shift to a light red tint (#FFEBEE) or a slightly darker gray border.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a subtle modern touch that softens the "institutional" feel without appearing overly casual or playful.

- **Buttons & Inputs:** 4px radius (Standard).
- **Cards & Containers:** 8px radius (Large).
- **Status Badges:** 2px radius (Small) or fully squared to denote a more formal classification.

## Components

### Buttons
- **Primary:** Solid Corporate Red (#D32F2F) with White text. Sharp 4px corners.
- **Secondary:** Ghost style. Transparent background with a 1px gray border (#D1D1D1).
- **Tertiary:** Text-only in Corporate Red for low-priority actions.

### Status Badges
Badges use a "Small Label" style with a subtle background tint and high-contrast text.
- **Open:** Light Blue background, Dark Blue text.
- **In Progress:** Light Amber background, Dark Brown text.
- **Resolved:** Light Green background, Dark Green text.

### Data Tables
Tables are the core of the system. Use 1px horizontal dividers only. No vertical lines. The header row should have a light gray background (#EEEEEE) with uppercase labels for maximum scannability.

### Input Fields
Inputs use a white background with a 1px gray border. On focus, the border transitions to Corporate Red with a 2px "glow" (outline) of 10% opacity Red. Labels are always positioned above the field, never as placeholders.

### Ticket Cards
In the dashboard view, tickets appear as Level 1 cards. They feature a vertical color-coded bar on the far left edge to indicate priority level (High = Red, Medium = Orange, Low = Gray).