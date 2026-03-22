# converter.shwrk

A privacy-first developer toolkit for encoding, decoding, formatting, hashing, and validating data — **100% client-side**.

All processing happens in your browser. No data is ever sent to a server.

**Live:** [converter.shwrk.com](https://converter.shwrk.com)

---

## Tools (30+)

### Encoding / Decoding

| Tool | Description |
| --- | --- |
| **Base64** | Encode/decode with full Unicode (UTF-8) support |
| **Base32** | RFC 4648 compliant encoding |
| **URL Encoding** | Percent-encode for URLs and query strings |
| **HTML Entities** | Convert `<`, `>`, `&`, quotes to HTML entities |
| **Unicode Escape** | `\u{XXXX}` escape sequences |
| **Hex** | Space-separated hex bytes |
| **Binary** | 8-bit binary representation |
| **Octal** | Octal byte representation |
| **ROT13** | Letter substitution cipher (self-reversing) |
| **Morse Code** | International Morse Code |
| **ASCII / Decimal** | Character code points |

### Formatting

| Tool | Description |
| --- | --- |
| **JSON Formatter** | Validate and pretty-print JSON |
| **XML Formatter** | Validate and indent XML |
| **CSV Formatter** | Align CSV columns |
| **Markdown Formatter** | Fix spacing in markdown |
| **SQL Formatter** | Uppercase keywords, add line breaks |
| **JSON to YAML** | Convert between JSON and YAML |

### Crypto & Hashing

| Tool | Description |
| --- | --- |
| **SHA-256** | Cryptographic hash (Web Crypto API) |
| **SHA-512** | 512-bit hash digest |
| **SHA-1** | Legacy hash (deprecated for security) |
| **JWT Decoder** | Inspect JWT header and payload |
| **UUID Generator** | Cryptographically random UUID v4 |

### Developer Tools

| Tool | Description |
| --- | --- |
| **Timestamp Converter** | Dates to Unix timestamps and back |
| **Color Converter** | Hex, RGB, and HSL conversion |
| **Number Base** | Decimal, Hex, Binary, Octal conversion |
| **URL Parser** | Break URLs into components |
| **Regex Tester** | Test patterns against input |
| **Cron Parser** | Explain cron expressions |

### Generators & Validators

| Tool | Description |
| --- | --- |
| **Lorem Ipsum** | Generate placeholder paragraphs |
| **Text Statistics** | Characters, words, lines, letter frequency |
| **Email Validator** | Format validation |
| **IP Address Validator** | IPv4 and IPv6 |

---

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** for fast builds and HMR
- **Tailwind CSS** + **DaisyUI** for theming (8 themes)
- **Web Crypto API** for hash functions
- Zero runtime dependencies beyond React

## Getting Started

```bash
# Clone and install
git clone https://github.com/your-username/encoding-converter.git
cd encoding-converter
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Converter.tsx        # Converter card UI
│   ├── ErrorBoundary.tsx    # React error boundary
│   └── SEO.tsx              # Dynamic meta tags
├── hooks/
│   └── useConverter.ts      # Shared conversion logic (sync + async)
├── layouts/
│   └── MainLayout.tsx       # Header, footer, theme switcher
├── pages/
│   └── HomePage.tsx         # Search, filtering, tool grid
└── utils/
    ├── converterConfigs.ts  # Tool registry
    └── encodingUtils.ts     # All encoding/decoding implementations
```

## Architecture

- **Client-side only** — No backend, no API calls. Your data stays in your browser.
- **Async-ready hook** — `useConverter` handles both synchronous encoders and async Web Crypto operations.
- **Error boundary** — Graceful error recovery without crashing the entire app.
- **Config-driven** — Adding a new tool requires only a utility function and a config entry.

## Adding a New Tool

1. Add your encode/decode/validate function to `src/utils/encodingUtils.ts`
2. Add a config entry to `src/utils/converterConfigs.ts`
3. That's it — the UI picks it up automatically

## Deployment

Auto-deploys to GitHub Pages on push to `main` via GitHub Actions. Custom domain configured via the `CNAME` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
