---
name: JobAlert CI Core
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c3c6cf'
  surface-tint: '#466083'
  primary: '#001832'
  on-primary: '#ffffff'
  primary-container: '#0f2d4d'
  on-primary-container: '#7b95bb'
  inverse-primary: '#aec8f0'
  secondary: '#835500'
  on-secondary: '#ffffff'
  secondary-container: '#feae2c'
  on-secondary-container: '#6b4500'
  tertiary: '#001d0a'
  on-tertiary: '#ffffff'
  tertiary-container: '#003417'
  on-tertiary-container: '#00aa58'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#aec8f0'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#2d4869'
  secondary-fixed: '#ffddb4'
  secondary-fixed-dim: '#ffb955'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#6bfe9c'
  tertiary-fixed-dim: '#4ae183'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: auto
  max-width: 1200px
---

## Brand & Style
The brand personality is professional, ambitious, and guiding. As a career-focused platform for the Ivorian market, the UI must feel reliable yet energetic—moving away from traditional stuffy corporate vibes toward a dynamic "Career Partner" aesthetic. 

The design style is **Corporate / Modern** with a focus on high-clarity information architecture. It leverages a mobile-first philosophy, ensuring that job seekers can navigate and apply seamlessly on the go. The visual narrative centers on "The Compass"—using directional cues, crisp lines, and a palette that balances authority (Deep Navy) with optimistic action (Dynamic Orange). 

**Emotional Response:**
- **Confidence:** "This platform is secure and professional."
- **Clarity:** "I know exactly where to find my next opportunity."
- **Momentum:** "I am moving forward in my career."

## Colors
The palette is rooted in a deep navy to establish trust, contrasted by a high-energy orange for primary actions.

- **Primary (#0F2D4D):** Used for navigation bars, primary headings, and brand-heavy components.
- **Secondary / Accent (#F5A623):** Reserved exclusively for Call-to-Action buttons, active states, and "Alert" indicators to ensure maximum visibility.
- **Background (#F4F7F9):** A soft, cool-tinted grey that reduces eye strain compared to pure white, providing a subtle canvas for content cards.
- **Surface (#FFFFFF):** Pure white is used for job cards, input fields, and containers to create a "lifted" effect against the background.
- **Success (#2ECC71):** A tertiary green for "Applied" statuses or "Profile Complete" indicators.

## Typography
This design system utilizes a dual-font approach to balance personality with readability. 

**Montserrat** is used for headings to convey ambition and a modern, geometric feel. Its bolder weights provide the necessary "authority" for a job platform. 

**Inter** is the workhorse for body copy, job descriptions, and UI labels. Its high x-height and neutral character ensure exceptional legibility on mobile screens where job seekers read long descriptions.

- Use `headline-lg` for landing hero sections.
- Use `body-md` for standard job descriptions.
- Use `label-md` for category chips and metadata (e.g., "Full-time", "Abidjan").

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict adherence to an 8px base unit. 

- **Mobile:** A single-column layout with 16px side margins. Cards span the full width of the safe area.
- **Tablet:** A 2-column masonry or grid for job listings to optimize screen real estate.
- **Desktop:** A 12-column grid with a maximum container width of 1200px. Standard sidebar-main layout for job search filters (3 columns sidebar, 9 columns main content).

Spacing between related items (like a job title and company name) should use `xs` (8px). Spacing between distinct sections or cards should use `md` (24px).

## Elevation & Depth
Depth is created using **Tonal Layers** combined with **Ambient Shadows**. This keeps the interface feeling light and modern without the heavy look of traditional enterprise software.

- **Level 0 (Background):** #F4F7F9. Used for the main canvas.
- **Level 1 (Cards/Surface):** Pure White with a very soft, diffused shadow. Shadow: `0px 4px 12px rgba(15, 45, 77, 0.05)`. This subtle navy tint in the shadow ties the elevation back to the brand color.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow to indicate interactivity. Shadow: `0px 8px 20px rgba(15, 45, 77, 0.1)`.
- **Interlays:** Thin 1px borders in a light neutral shade (#E2E8F0) are used instead of shadows for secondary elements like form inputs or internal card dividers.

## Shapes
The shape language is **Rounded**, striking a balance between the rigid professionalism of sharp corners and the overly casual nature of pill shapes.

- **Standard Elements (Inputs, Cards):** 0.5rem (8px) corner radius.
- **Buttons:** 0.5rem (8px) for a sturdy, actionable feel.
- **Chips/Badges:** 1rem (16px) or fully rounded to distinguish them from buttons.
- **Icons:** Linear, 2px stroke width, with slightly rounded terminal ends to match the typography.

## Components

### Buttons
- **Primary:** Background #F5A623, Text #FFFFFF. Bold weight. Used for "Apply Now" or "Post a Job."
- **Secondary:** Transparent background, Border 2px #0F2D4D, Text #0F2D4D. Used for "Learn More" or "Filter."
- **Tertiary:** No border, Text #0F2D4D with an underline or arrow icon on hover.

### Cards (Job Listings)
White background, 8px radius, level 1 shadow. Must include:
- Company Logo (left-aligned or top-left).
- Job Title (`headline-sm`, Primary color).
- Metadata row (Location, Salary, Time) using `body-sm` and simple linear icons.
- A "New" or "Hot" badge in the top right corner using the secondary color.

### Input Fields
- White background with a 1px #E2E8F0 border.
- 8px border radius.
- On focus: Border becomes 2px #0F2D4D with a soft glow.

### Chips & Tags
- Used for job categories (e.g., "IT", "Finance").
- Background: #0F2D4D at 10% opacity, Text: #0F2D4D.
- Rounded-xl for a pill-like appearance.

### Icons
- Use simple, 24px linear icons (e.g., Lucide or Feather style).
- Default icon color: #0F2D4D (60% opacity).
- Primary action icons: #F5A623.