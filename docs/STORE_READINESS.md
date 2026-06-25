# OpenProof Store Readiness Checklist

> Standardized release checklist for app store and distribution platform readiness.

## Web / PWA

- [x] Manifest file (`public/manifest.json`) with correct icons, colors, display mode
- [x] Service worker (`public/sw.js`) with cache-first strategy
- [x] iOS splash screens (8 sizes)
- [x] Web splash screen (1280px)
- [x] OG image (`public/og.png`) — 1200×630
- [x] Favicon (ICO + PNG, works on dark/light tabs)
- [x] Apple touch icon (`public/apple-touch-icon.png`)
- [x] Cross-platform icons (192px, 512px, SVG)
- [x] Sitemap / robots.txt
- [ ] meta theme-color tag
- [ ] PWA install prompt handling

## iOS App Store

- [ ] Icon (1024×1024, no transparency)
- [ ] Screenshots (6.7" iPhone + 12.9" iPad)
- [ ] App Store description (4,000 char max)
- [ ] Keywords list
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL
- [ ] Age rating declaration
- [ ] Content rights confirmation
- [ ] Demo account / video preview

## Google Play Store

- [ ] Icon (512×512, 32-bit PNG)
- [ ] Feature graphic (1024×500)
- [ ] Screenshots (2–8 required, 16:9 or 9:16)
- [ ] Short description (80 char max)
- [ ] Full description (4,000 char max)
- [ ] Privacy policy URL
- [ ] App category selection
- [ ] Content rating questionnaire
- [ ] Target audience selection
- [ ] In-app products (if any)

## Microsoft Store (MSIX)

- [ ] App icon (44×44, 150×150, 256×256)
- [ ] Store logo (50×50)
- [ ] Screenshots (1366×768 minimum)
- [ ] Description
- [ ] Privacy policy URL
- [ ] Support contact info
- [ ] Age rating

## Windows (MSIX)

- [ ] Identity name
- [ ] Publisher display name
- [ ] Logo assets
- [ ] Visual assets for Start menu, taskbar
- [ ] Protocol associations

## macOS (DMG / .app)

- [ ] App icon (.iconset, all required sizes)
- [ ] Code signing certificate
- [ ] Notarization
- [ ] App sandbox entitlements
- [ ] Hardened runtime

## Android (APK / AAB)

- [ ] Adaptive icon (foreground + background layers)
- [ ] Monochrome icon (Android 13+)
- [ ] Round icon
- [ ] Store listing icon
- [ ] Feature graphic

## Legal

- [x] Privacy policy (native `/privacy`)
- [x] Terms of service (native `/terms`)
- [ ] Support email contact
- [ ] Copyright notice in footer
- [ ] Open-source license link (AGPL-3.0)

## Quality Gates

- [ ] Lighthouse ≥ 90 in all categories
- [ ] WCAG 2.2 AA compliance
- [ ] Works offline for cached pages
- [ ] Touch targets ≥ 44px
- [ ] Readable without zoom at 375px
- [ ] Keyboard navigable
- [ ] No console errors in production
- [ ] Network error states handled gracefully
