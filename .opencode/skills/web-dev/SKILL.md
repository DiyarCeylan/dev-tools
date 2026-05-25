---
name: web-dev
description: Use when building or improving static HTML/CSS/JS websites, especially directory sites, tool reviews, or landing pages. Covers responsive design, accessibility, SEO, performance, and professional UI patterns.
---

# Web Development Skill

You are a senior front-end web developer. When working on static HTML/CSS/JS sites, follow these principles:

## HTML
- Every page MUST have `lang="en"`, viewport meta, and a unique `<title>`.
- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Include Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and Twitter Card meta tags.
- Add JSON-LD structured data: `Product`+`Review` for review pages, `Article`+`BreadcrumbList` for blog posts, `Organization`+`WebSite` for homepage.
- Use `rel="canonical"` on every page to prevent duplicate content issues.
- Use `aria-label`, `aria-current="page"`, and `role` attributes for accessibility.
- Include a skip-link for keyboard users.
- All `<a>` tags linking to external/AI tool sites should use `rel="sponsored noopener noreferrer"` (affiliate links).
- Forms must use proper `<label>` elements, `name` attributes, and include a honeypot field for spam prevention.

## CSS
- Use CSS custom properties (variables) for all colors, spacing, shadows, and border-radius values in `:root`.
- Define a `[data-theme="dark"]` block that overrides only the variables that change in dark mode.
- Support `prefers-color-scheme: dark` for OS-level dark mode.
- Use `clamp()` for fluid typography (e.g., `font-size: clamp(1.5rem, 3vw, 2.25rem)`).
- Use `will-change: transform, opacity` on animated elements for GPU acceleration.
- Use `@media (prefers-reduced-motion: reduce)` to disable animations for accessibility.
- Include `@media print` styles.
- Design mobile-first with breakpoints at 420px, 480px, 768px, and 1400px.
- Use `scroll-behavior: smooth` for anchor links.
- Use `backdrop-filter: blur()` for glassmorphism headers and modals.
- Always use CSS variables instead of hardcoded colors (`var(--accent)` not `#3B82F6`).

## JavaScript
- Wrap all code in `DOMContentLoaded` listener (with `pageshow` for bfcache).
- Use `requestAnimationFrame` or debounce for scroll/resize handlers.
- Use `textContent` or `insertAdjacentHTML` instead of `innerHTML` when dealing with any user-influenced data (XSS prevention).
- Use simulated `<a>` click instead of `window.open()` to avoid popup blockers.
- Add keyboard event listeners (Enter/Space) for all interactive elements (buttons, toggles).
- Check `navigator.onLine` before form submissions and show user feedback.
- Never send PII (emails, names) to analytics; hash or anonymize first.
- Use `IntersectionObserver` for scroll-triggered animations.
- Use `fetch` or `XMLHttpRequest` only when actually needed (static sites may not need them).

## SEO
- Each page needs unique meta description (150-160 chars).
- Maintain a complete `sitemap.xml` with all URLs, lastmod dates, priorities.
- Provide `robots.txt` with sitemap reference.
- Use breadcrumb navigation with JSON-LD `BreadcrumbList` schema.
- Category count badges should match the actual number of items in the category.
- Use descriptive, keyword-rich URLs (e.g., `/reviews/jasper-ai.html` not `/review1.html`).

## Performance
- Use `<link rel="preconnect">` for third-party origins (Google Fonts, analytics).
- Inline critical CSS for dark mode to prevent flash of wrong theme.
- Defer non-critical JS with `defer` or place at end of `<body>`.
- Use SVG for icons and logos (no icon font libraries).
- Add `loading="lazy"` on images below the fold.
- Use `<picture>` with WebP/AVIF formats when serving real images.

## Design Patterns for Directory Sites
- Homepage: hero section → search bar → category grid → featured tools → newsletter → footer.
- Category page: page header → tools grid (tool cards with logo, name, rating, description, CTA buttons).
- Review page: breadcrumb → review header → ToC → overview → features → pricing → pros/cons → verdict → CTA.
- Tool card design: logo (left) → name + badge (top) → description → rating + category → two CTA buttons.
- Always provide two CTAs: "Read Review" (secondary) and "Try Free" (primary/accent).
- Use `/go/{slug}` pattern for affiliate redirects, mapped client-side in JS.
- Newsletter and contact forms should submit via Netlify Forms or similar serverless handler.

## Affiliate Links
- Define a slug→URL mapping object in JS.
- Intercept clicks on `/go/{slug}` links, prevent default, open via simulated `<a>` click.
- Track clicks with Google Analytics `gtag('event', 'click', { event_category: 'Affiliate Link', event_label: slug })`.
- Use `transport_type: 'beacon'` for reliable event delivery.
