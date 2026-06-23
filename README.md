# WhetKit — Free Developer Tools

[![MIT](https://img.shields.io/badge/license-MIT-teal)](LICENSE)

A collection of **free, privacy-first, client-side developer tools** — all running entirely in your browser with zero server uploads.

> **Live site:** [diyarceylan.github.io/WhetKit](https://diyarceylan.github.io/WhetKit/)

## Quick Start

```bash
git clone https://github.com/DiyarCeylan/WhetKit.git
cd WhetKit
npx serve .
```

Open `http://localhost:3000`. Every tool is a single HTML file — no build step, no dependencies.

## Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | [URL Encoder / Decoder](https://diyarceylan.github.io/WhetKit/url-encoder-decoder/) | Encode and decode URL strings |
| 2 | [Base64 Encoder / Decoder](https://diyarceylan.github.io/WhetKit/base64-encoder-decoder/) | Encode text/files to Base64 and decode back |
| 3 | [UUID Generator](https://diyarceylan.github.io/WhetKit/uuid-generator/) | Generate UUID v1, v4, v7 in bulk |
| 4 | [JSON to CSV Converter](https://diyarceylan.github.io/WhetKit/json-to-csv-converter/) | Convert JSON arrays to CSV with nested flattening |
| 5 | [JSON Formatter & Validator](https://diyarceylan.github.io/WhetKit/json-formatter-validator/) | Format, validate, and minify JSON |
| 6 | [Regex Tester](https://diyarceylan.github.io/WhetKit/regex-tester/) | Test regular expressions in real-time |
| 7 | [HTML Entity Encoder / Decoder](https://diyarceylan.github.io/WhetKit/html-entity-encoder-decoder/) | Encode/decode HTML special characters |
| 8 | [JWT Parser](https://diyarceylan.github.io/WhetKit/jwt-parser/) | Decode and inspect JWT tokens |
| 9 | [Color Converter](https://diyarceylan.github.io/WhetKit/color-converter/) | Convert between HEX, RGB, HSL, OKLCH |
| 10 | [Text Diff Checker](https://diyarceylan.github.io/WhetKit/text-diff-checker/) | Side-by-side text comparison |
| 11 | [HEX to HSL](https://diyarceylan.github.io/WhetKit/hex-to-hsl/) | Convert hex colors to HSL |
| 12 | [Base64 Image Converter](https://diyarceylan.github.io/WhetKit/base64-image-converter/) | Images to/from Base64 data URIs |
| 13 | [Epoch Converter](https://diyarceylan.github.io/WhetKit/epoch-converter/) | Unix timestamp to human date and back |
| 14 | [HTML Preview](https://diyarceylan.github.io/WhetKit/html-preview/) | Live HTML/CSS/JS sandbox |
| 15 | [SQL Formatter](https://diyarceylan.github.io/WhetKit/sql-formatter/) | Format and beautify SQL queries |

## Features

- **100% client-side** — no data ever leaves your device
- **Zero dependencies** — every tool is a single HTML file with vanilla JS
- **Dark / Light theme** — system-aware with manual toggle
- **PWA ready** — installable, works offline
- **Privacy-focused analytics** — GoatCounter, no cookies
- **SEO optimized** — JSON-LD structured data, sitemap, OG tags
- **Mobile-first responsive design**

## Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic structure |
| **CSS3** (vanilla) | OKLCH color system, CSS Grid, Flexbox, design tokens |
| **JavaScript** (vanilla ES6) | All tool logic, theme toggle, localStorage |
| **JetBrains Mono / DM Mono** | Monospace typefaces (Google Fonts) |
| **GoatCounter** | Privacy-first analytics |
| **Schema.org JSON-LD** | Structured data for SEO |

Zero frameworks, zero build tools, zero package dependencies.

## Project Structure

```
/
├── index.html                    # Tool hub with search
├── favicon.svg                   # Brand icon
├── manifest.json                 # PWA manifest
├── robots.txt / sitemap.xml      # SEO
├── about/                        # About page
├── contact/                      # Contact page
├── privacy/                      # Privacy policy
├── terms/                        # Terms of service
├── blog/                         # 14 educational guides
├── base64-encoder-decoder/       # Tools (one directory each)
├── color-converter/
├── uuid-generator/
├── json-formatter-validator/
├── ...                           # All other tools
└── LICENSE
```

## Deployment

Push to `main` — GitHub Pages serves from the root automatically.
