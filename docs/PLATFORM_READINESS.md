# OpenProof — Platform Readiness Report

**Version:** 0.1.1  
**Date:** 2026-06-21

## 1. Platform Coverage

### 1.1 Web / PWA

| Requirement | Status | Notes |
|-------------|--------|-------|
| PWA manifest | ✅ | `public/manifest.json` — standalone display, theme color #0052FF, background #f8f8f3 |
| Service worker | ✅ | `public/sw.js` — cache-first for static assets, network-first for navigation |
| Install prompt | ✅ | PWA meets installability criteria (manifest + SW + HTTPS) |
| Offline support | ✅ | Cached shell available; core pages work after initial visit |
| Icons (192/512) | ✅ | `public/icon-192x192.png`, `public/icon-512x512.png` |
| Apple touch icon | ✅ | `public/apple-touch-icon.png` (180×180) |
| Favicon | ✅ | `public/favicon.ico` (16/32/48/64), `public/favicon.png` |
| Splash screens | ✅ | `public/splash/` — web and iOS sizes |
| Desktop screenshots | ✅ | `public/screenshots/` — home, create, verify, proof, mobile |
| OG preview | ✅ | `public/og.png` (1200×630) |
| Security headers | ✅ | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy in `vercel.json` |

### 1.2 Windows (MSIX)

| Requirement | Status | Notes |
|-------------|--------|-------|
| ICO file | ✅ | `assets/windows/icon.ico` — multi-resolution (16 to 256) |
| Store logo (71×71) | ✅ | `assets/windows/store-logo-71.png` |
| Store logo (150×150) | ✅ | `assets/windows/store-logo-150.png` |
| Store logo (310×310) | ✅ | `assets/windows/store-logo-310.png` |
| Store logo (310×150) | ✅ | `assets/windows/store-logo-310x150.png` |
| Splash screen (620×300) | ❌ | Not yet generated. Will be added on first MSIX packaging. |
| Splash screen (868×420) | ❌ | Not yet generated. |
| Splash screen (1116×540) | ❌ | Not yet generated. |
| MSIX package | 📝 | Documented strategy below — no packaging tooling set up yet. |

**MSIX packaging strategy:**

1. Use PWABuilder (https://pwabuilder.com) to generate MSIX package from the PWA URL.
2. Replace generated icons with the canonical icon set in `assets/windows/`.
3. Configure package identity, display name, and publisher from store metadata.
4. Sign with a valid code-signing certificate (see Windows Store requirements).
5. Submit to Microsoft Store via Partner Center.

### 1.3 macOS (DMG)

| Requirement | Status | Notes |
|-------------|--------|-------|
| .iconset directory | ✅ | `assets/icon.iconset/` — all 10 required sizes |
| ICNS generation | ⚠️ | Requires `iconutil` on macOS to convert iconset → icns |
| DMG packaging | 📝 | Documented strategy below |

**macOS distribution strategy:**

1. For a web-app wrapper (e.g., PWA → macOS via PWA Builder or nativefier):
   - Use `assets/icon.iconset/` as the app icon source.
   - Run `iconutil -c icns assets/icon.iconset/` on macOS to produce `icon.icns`.
2. For a native Catalyst/SwiftUI wrapper (future):
   - Xcode project would reference icons from `assets/ios-icons/` and `assets/icon.iconset/`.
3. DMG creation (for web-wrapper distribution):
   - Use `create-dmg` or `appdmg` to package the wrapper app.
   - Sign with an Apple Developer ID certificate for notarization.
4. Distribution options:
   - Direct download from website (notarized DMG).
   - Mac App Store via App Store Connect.

### 1.4 iOS (App Store)

| Requirement | Status | Notes |
|-------------|--------|-------|
| App icon set | ✅ | `assets/ios-icons/` — all required sizes (40, 58, 60, 80, 87, 120, 180, 1024) |
| Splash screens | ✅ | `public/splash/` — all iOS device sizes |
| App Store description | ✅ | Documented in `docs/STORE_METADATA.md` |
| Keywords | ✅ | Documented in `docs/STORE_METADATA.md` |
| Age rating | ✅ | 4+ / Everyone — documented in `docs/STORE_METADATA.md` |
| Privacy policy | ✅ | `docs/PRIVACY.md` |
| Terms of service | ✅ | `docs/TERMS.md` |
| Support email | ✅ | GitHub Issues (https://github.com/sparshsam/openproof/issues) |
| Screenshots | ✅ | Desktop: 1280×800, Mobile: 414×896 |

**iOS distribution strategy:**

1. OpenProof is primarily a web app. For an App Store presence:
   - Create a WKWebView wrapper (Swift) using the canonical icons and splash screens.
   - Configure App Store Connect listing with metadata from `docs/STORE_METADATA.md`.
   - Handle wallet connections through WKWebView (WalletConnect via deep link / universal link).
2. App Review considerations:
   - No objectionable content → 4+ rating is appropriate.
   - No required account → complies with guideline 5.1.1.
   - Wallet connection is user-initiated → no permission issues.
   - Onchain transactions are clearly user-initiated with wallet confirmations.

### 1.5 Android (Play Store)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Launcher icons (mdpi-xxxhdpi) | ✅ | `assets/android/mipmap-*` — density-based variants |
| Adaptive foreground | ✅ | `assets/android/drawable/ic_launcher_foreground.png` (108×108) |
| Adaptive background | ✅ | `assets/android/drawable/ic_launcher_background.png` (108×108, white) |
| Play Store icon (512×512) | ✅ | `assets/android/play-store-icon.png` |
| Privacy policy | ✅ | `docs/PRIVACY.md` |
| Age rating | ✅ | Everyone — documented in `docs/STORE_METADATA.md` |
| APK/AAB package | 📝 | Documented strategy below |

**Android distribution strategy:**

1. OpenProof is primarily a web app. For Play Store presence:
   - Use a Trusted Web Activity (TWA) with Bubblewrap to wrap the PWA.
   - Bubblewrap will read `public/manifest.json` for configuration.
   - Replace auto-generated icons with canonical icons from `assets/android/`.
   - Sign with a release keystore.
2. App content rating:
   - Self-assessment: Everyone (no restricted content).
   - Submit content questionnaire in Play Console using answers from `docs/STORE_METADATA.md`.

---

## 2. Operational Strategy

### 2.1 Crash Reporting Strategy

| Platform | Strategy | Implementation |
|----------|----------|----------------|
| Web / PWA | No automatic crash reporting in v0.1.1 | OpenProof has no analytics or error-tracking libraries. Errors surface in the browser console. Users can report issues via GitHub. |
| Windows (MSIX) | Optional Sentry or App Center | If wrapped, consider Sentry SDK or Visual Studio App Center for crash reporting. Not implemented in v0.1.1. |
| macOS | Optional crash reporter | If distributed as DMG, consider setting up a macOS crash reporter. Not implemented in v0.1.1. |
| iOS | App Store crash logs | Automatically available through App Store Connect. No third-party crash reporter in v0.1.1. |
| Android | Play Console crash reports | Automatically available through Google Play Console. No third-party crash reporter in v0.1.1. |

**Decision:** OpenProof does not include crash reporting in v0.1.1. Crash reporting will be evaluated when there is real user adoption to justify the privacy trade-off. All platforms provide baseline crash reporting through their respective app stores.

### 2.2 Analytics Strategy

| Platform | Strategy | Implementation |
|----------|----------|----------------|
| All | **No analytics in v0.1.1** | OpenProof deliberately ships without analytics, tracking, or telemetry. This is an architectural commitment: local-first, no hidden data collection. |

**Future consideration:** If usage data becomes necessary for product decisions, opt-in, privacy-preserving analytics (e.g., no IP logging, no session tracking, aggregate-only) may be considered. Any future analytics would be:
- Opt-in only (default off).
- Documented in the privacy policy.
- Aggregated and anonymized.
- Free of third-party tracking networks.

### 2.3 Versioning Strategy

| Aspect | Approach |
|--------|----------|
| Scheme | [Semantic Versioning 2.0.0](https://semver.org/) — `MAJOR.MINOR.PATCH` |
| Current | `0.1.1` (pre-release; major version 0 indicates initial development) |
| Patch bumps | Bug fixes, documentation updates, icon/splash additions, dependency updates |
| Minor bumps | New features, UX improvements, spec updates, contract additions |
| Major bumps | API/contract breaking changes, production mainnet deployment, stable release |
| Tag format | `v{Major}.{Minor}.{Patch}` (e.g., `v0.1.1`) |
| Changelog | `CHANGELOG.md` — every release gets an entry with `Added`, `Changed`, `Fixed`, `Security` sections |
| Source of truth | `package.json` — canonical version; `src/lib/receipt.ts` — in-app version for receipts |
| Version alignment | Version number is manually aligned across all files on release |

### 2.4 Update Mechanism per Platform

| Platform | Mechanism | Notes |
|----------|-----------|-------|
| Web / PWA | Next.js static deployment → instant update on next page load | Service worker caches may need to be invalidated; versioned cache names in `sw.js` handle this automatically on `activate`. |
| Windows (MSIX) | Microsoft Store auto-updates | Once published, Store handles updates. PWABuilder-generated packages can be updated by publishing a new Store submission. |
| macOS | App Store auto-updates (Mac App Store) | If distributed via Mac App Store. For direct DMG: manual download. |
| iOS | App Store auto-updates | Standard App Store update flow. |
| Android | Play Store auto-updates (in-app update API optional) | Standard Play Store update flow. |

### 2.5 Store-Compliant Permissions

| Platform | Permissions Requested | Rationale |
|----------|-----------------------|-----------|
| Web / PWA | None | No camera, microphone, geolocation, or payment API calls. Permissions-Policy headers explicitly deny all sensitive APIs. |
| Windows (MSIX) | `internetClient` | Required for blockchain RPC and WalletConnect connections. All capabilities are declared in the package manifest. |
| macOS | Network access | Required for same reasons. |
| iOS | WalletConnect via deep links | `LSApplicationQueriesSchemes` for wallet apps. No camera, photo library, or location permissions. |
| Android | Internet | Required for blockchain RPC. `android.permission.INTERNET` only. |

**Principle:** OpenProof requests the minimum permissions necessary. No storage, camera, location, contacts, or phone permissions are used or requested.

### 2.6 Data Deletion Workflow

Since OpenProof does not store user data on any server, data deletion is entirely client-side:

| Data Type | Location | Deletion Method |
|-----------|----------|-----------------|
| Local proof history | Browser local storage | Clear via app UI (future), or clear browser site data, or `localStorage.clear()` in dev tools |
| Proof receipts | User's local file system | User manages their own downloaded files — standard OS file deletion |
| Connected wallet info | Browser session | Disconnect wallet in-app or clear browser site data |
| Onchain proofs | Public blockchain | **Cannot be deleted** — blockchain is immutable by design. This is an intentional property, not a limitation. The proof of existence system is permanent. |
| Browser cache (service worker) | Browser cache storage | Controlled by service worker; cache is versioned and old caches are cleaned on new SW activation |

**Privacy consideration:** Because onchain data is permanent, users should not register hashes of content they may later need to delete or keep private. This is documented in the privacy policy, terms of service, and threat model.

### 2.7 Accessibility Review

| Area | Status | Details |
|------|--------|---------|
| Keyboard navigation | ✅ | Skip-to-content link, visible focus indicators, semantic `<nav>` with `aria-label` |
| Semantic HTML | ✅ | Header, main, footer landmarks; proper heading hierarchy |
| Color contrast | ✅ | Design tokens ensure sufficient contrast ratios |
| Reduced motion | ✅ | Design system respects `prefers-reduced-motion` |
| Screen reader support | ✅ | `aria-label` on nav elements, status announcements on proof actions |
| Focus management | ✅ | Focus trap considerations in modals (if any) |
| Touch targets | ✅ | Interactive elements sized for mobile touch (≥44px) |
| Text scaling | ✅ | Responsive layout accommodates font scaling |
| Form labels | ✅ | File drop zone has accessible label |
| Copy button | ✅ | `aria-label="Copy to clipboard"`, announces success/failure |

**Outstanding items for future releases:**
- Full keyboard navigation through the proof creation flow (tab order audit).
- Live region announcements for registration lifecycle (submitting, confirming, confirmed, failed).
- Formal WCAG 2.1 AA audit before v1.0.
