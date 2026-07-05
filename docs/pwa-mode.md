# Website Mode vs Installed PWA Mode

OpenProof supports two interaction models sharing the same product identity.

## Website Mode (default)

- Accessed via any browser at `https://proof.kovina.org`
- Full marketing/editorial pages: Home, About, Privacy, Terms, Docs
- SEO-optimized metadata and OpenGraph tags
- Traditional website footer with navigation links
- Create, Verify, and proof explorer pages with explanatory copy
- PWA install prompt available but optional

**Routes:**
- `/` — Marketing homepage
- `/create` — Create proof (with explanatory copy)
- `/verify` — Verify proof (with receipt import)
- `/about`, `/privacy`, `/terms`, `/docs` — Editorial pages
- `/proof/[hash]` — Public proof page
- `/bundle/[hash]` — Bundle proof page

## Installed PWA Mode

- Accessed after installing OpenProof as a PWA (Chrome, Safari, Edge)
- Launches at `/app?source=pwa` (configured in manifest.json)
- Focused workbench with minimal copy — action-first
- No marketing footer or editorial framing
- Compact app header with online/offline status
- Mobile bottom tab navigation (Create, Verify, History, More)
- Desktop: same workbench with keyboard-friendly layout
- App splash screen on first load (light/dark theme-aware)

**Routes:**
- `/app` — App workbench (quick actions + recent proofs + testnet notice)
- `/app/verify` — Redirects to `/verify`
- `/app/history` — Combined registered + verified proof history
- `/app/more` — About, Docs, GitHub links

## Detection

The app detects PWA mode via `usePwaMode()` which checks:
- `display-mode: standalone` CSS media query
- `display-mode: fullscreen` / `minimal-ui`
- iOS `navigator.standalone`
- URL parameter `?source=pwa` / `?mode=pwa` (fallback)

## Key Constraints

- No accounts, analytics, telemetry, backend, sync, or notifications
- All proof history remains in browser localStorage only
- Same wallet (RainbowKit/wagmi) and chain (Base Sepolia)
- Same CSP and security headers
- Static export / Capacitor compatible
