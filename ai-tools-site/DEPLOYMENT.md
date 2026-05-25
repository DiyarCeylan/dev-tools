# AI Tools Directory - Deployment Guide

## What's New (Latest Improvements)

### ✅ All Affiliate Redirects Fixed
- All 54 `/go/{slug}` redirects defined in `netlify.toml` with standardized `ref=aitoolsdir` parameter
- Placeholder IDs replaced (`YOUR_ID` → `aitoolsdir`)
- `/not-found` redirect status corrected from 302 to 404

### 🔒 Security Headers (netlify.toml)
- **Content Security Policy (CSP)** — Restricts scripts, styles, fonts, and connections to trusted origins
- **Strict-Transport-Security (HSTS)** — Enforces HTTPS with preload
- **Permissions-Policy** — Disables camera, microphone, geolocation, and interest cohort
- Enhanced `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`

### 📱 Progressive Web App (manifest.json)
- PWA manifest with standalone display, theme color (#0F172A), lang, and SVG icons
- Theme-color meta tag injected via JS on all pages

### 📡 RSS Feed (feed.xml)
- RSS 2.0 feed listing all 6 blog posts with correct dates, titles, descriptions, and links
- RSS `<link>` tag included in `<head>` of every page (no longer JS-dependent)

### 🖼️ Images
- `images/og-default.svg` — 1200x630 SVG placeholder for Open Graph sharing
- `images/icons/icon-192.svg` and `icon-512.svg` — PWA icons
- `images/reviews/placeholder.svg` — Review thumbnail placeholder

### 🧭 Navigation & Accessibility
- Skip-to-content links on every page for keyboard users
- `role="main"` landmarks on all main content sections
- Breadcrumb navigation on all pages (categories, reviews, blog, legal, etc.)
- `aria-current="page"` dynamically set via JS on active nav links
- `scope="col"` on comparison table headers for screen readers

### 📊 Structured Data (JSON-LD)
- Every review page: `Product` + `Review` + `BreadcrumbList` schema
- Category pages: `CollectionPage` + `BreadcrumbList` schema
- Blog listing: `Blog` schema with breadcrumbs
- Blog posts: `Article` + `BreadcrumbList` schema
- About page: `AboutPage` + `BreadcrumbList`
- Contact page: `ContactPage` + `BreadcrumbList`
- Legal pages: `WebPage` + `BreadcrumbList`

### 🧹 Technical Fixes
- `404.html`: Canonical URL now points to homepage (not self)
- `comparisons.html`: Breadcrumb added, table headers use `scope="col"`
- `midjourney-vs-dalle.html`: Date inconsistency fixed (all now show May 8, 2026)
- `cursor.html`: Missing JSON-LD added (was the only review without it)

---

## Publish via GitHub Pages (Free)

Since you have a GitHub Education account, GitHub Pages is the ideal way to publish your site.

### Step 1: Create a GitHub Repository

1. Go to **https://github.com**
2. Click the **+** icon and select **New repository**
3. Name it `ai-tools-directory` (or any name)
4. Set it to **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Files

1. Open the `ai-tools-site` folder
2. Drag and drop **all files and folders** onto the GitHub upload page
3. Scroll down and click **Commit changes**

### Step 3: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Branch**, select `main` and `/ (root)` folder
3. Click **Save**
4. Wait 1-2 minutes for deployment

Your site will be live at: `https://yourusername.github.io/ai-tools-directory/`

---

## Next Steps

### 1. Apply for Affiliate Programs

| Program | Commission | Link |
|---------|-----------|------|
| Jasper AI | 30% recurring | https://jasper.ai/affiliates |
| Copy.ai | 20% recurring | https://copy.ai/affiliate |
| Surfer SEO | 25% recurring | https://surferseo.com/affiliate |
| GetResponse | 33% recurring | https://getresponse.com/affiliate |
| Grammarly | 20% recurring | https://www.grammarly.com/affiliate |
| Amazon Associates | 3-10% | https://affiliate-program.amazon.com |
| ChatGPT | Referral | https://chatgpt.com |
| Canva | Referral | https://canva.com |
| ElevenLabs | Referral | https://elevenlabs.io |
| Notion | Referral | https://notion.so |
| Midjourney | Referral | https://midjourney.com |
| Suno | Referral | https://suno.com |
| Semrush | 40% recurring | https://semrush.com/affiliate |
| Ahrefs | 25% recurring | https://ahrefs.com/affiliate |
| Hostinger | 60% recurring | https://hostinger.com/affiliate |

### 2. Replace Google Analytics ID

Replace `G-XXXXXXXXXX` with your real ID in:
- All HTML files (static site, find/replace across all files)
- The Google Analytics snippet

### 3. Add Real Images

Replace placeholder images in `images/reviews/` with actual tool screenshots/logos.

### 4. Add Google Search Console

1. Go to **https://search.google.com/search-console**
2. Add your site URL
3. Submit `sitemap.xml`
4. Monitor search rankings

---

## File Structure

```
ai-tools-site/
├── index.html                  (Home page)
├── about.html                  (About page)
├── contact.html                (Contact page)
├── 404.html                    (404 error page)
├── privacy-policy.html         (Privacy Policy)
├── terms-of-service.html       (Terms of Service)
├── affiliate-disclosure.html   (Affiliate Disclosure)
├── netlify.toml                (Netlify redirects + headers config)
├── sitemap.xml                 (XML sitemap for SEO)
├── robots.txt                  (Robots exclusion standard)
├── manifest.json               (PWA manifest)
├── feed.xml                    (RSS feed)
├── favicon.svg                 (Site favicon)
├── DEPLOYMENT.md               (This file)
├── css/
│   └── style.css               (1535 lines - all styles)
├── js/
│   └── main.js                 (528 lines - all JavaScript)
├── images/
│   ├── og-default.svg          (OG image placeholder)
│   ├── icons/
│   │   ├── icon-192.svg
│   │   └── icon-512.svg
│   └── reviews/
│       └── placeholder.svg     (Review thumbnail placeholder)
├── reviews/                    (54 tool reviews)
├── categories/                 (9 category pages)
├── blog/                       (6 blog posts + listing)
└── comparisons/
    └── comparisons.html        (Tool comparison pages)
```

---

## How to Add New Content

### Add a New Tool Review

1. Copy an existing review (e.g., `reviews/jasper-ai.html`)
2. Rename it (e.g., `reviews/new-tool.html`)
3. Update all content, JSON-LD, breadcrumbs, and meta tags
4. Add tool card to relevant category page and `index.html` featured section
5. Add affiliate redirect in `netlify.toml` and affiliate link in `js/main.js`
6. Add to `sitemap.xml`
7. Commit and push

### Add a New Blog Post

1. Copy an existing blog post file
2. Rename and edit content, JSON-LD, meta tags
3. Add card to `blog/blog.html` blog grid
4. Add to `feed.xml` and `sitemap.xml`
5. Commit and push

---

## Tips for Growing the Site

1. **Publish consistently** — Add new reviews and blog posts regularly
2. **Focus on SEO** — Use descriptive titles and meta descriptions
3. **Share on social media** — Promote content on relevant platforms
4. **Update regularly** — Keep reviews current with latest features and pricing
5. **Add more tools** — More content = more traffic
6. **Submit sitemap** to Google, Bing, and other search engines
