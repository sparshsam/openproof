# OpenProof — Manual Tasks for Sparsh

> Tasks that require platform-specific tooling, SDKs, store accounts, or physical device testing.
> These cannot be automated and must be done manually.

---

## WINDOWS — MSIX Store Submission

### Prerequisites
- [ ] Windows machine with Visual Studio (for MSIX packaging)
- [ ] Windows App Certification Kit (included with Windows SDK)
- [ ] Microsoft Partner Center account (for Windows Store submission)

### Tasks
- [ ] **Build the MSIX package**
  - [ ] Run the Windows App Certification Kit on the project
  - [ ] Package `out/` static export into MSIX using AppxManifest.xml in `assets/windows/`
  - [ ] Sign the package with a code signing certificate
- [ ] **Test keyboard shortcuts on Windows**
  - [ ] Tab through all pages (Create, Verify, About, Proof explorer)
  - [ ] Enter/Escape on buttons and dialogs
  - [ ] Ensure skip-to-content link works
- [ ] **Test window resize behavior**
  - [ ] Test at 800px, 1024px, 1280px, 1440px+ widths
  - [ ] Verify nav collapses to mobile menu at small widths
  - [ ] Verify no horizontal scrollbars at any width
- [ ] **Windows Store validation**
  - [ ] Submit the signed MSIX to Partner Center
  - [ ] Complete the Store listing (description, screenshots, category, age rating)
  - [ ] Pass Windows App Certification Kit tests

---

## ANDROID — Capacitor / Play Store

### Prerequisites
- [ ] Android Studio installed (with Android SDK)
- [ ] Google Play Console account ($25 one-time fee)
- [ ] Java 17+ for Android builds

### Tasks
- [x] **Initialize Capacitor Android project** — DONE (`npx cap add android`)
- [ ] **Build signed AAB**
  - [ ] Open `android/` in Android Studio
  - [ ] Generate a signed AAB with your Play Store upload key
  - [ ] Test the AAB on a physical device or emulator
  - [ ] Run: `npm run cap:build:android` before opening Android Studio (builds static export + syncs)
- [ ] **Test share sheet**
  - [ ] Share a proof URL from the app to other apps (Messages, Email, Notes)
  - [ ] Verify the URL is correct (`https://proof.kovina.org/proof/<hash>`)
- [ ] **Test file picker on Android**
  - [ ] Select files from Downloads, Gallery, Google Drive picker
  - [ ] Select multiple files for bundle proofs
  - [ ] Verify large files work (up to 100MB)
- [ ] **Test background restrictions (Android 12+)**
  - [ ] Enable battery optimization for the app
  - [ ] Put app in background, verify it returns to correct state
  - [ ] Test with "Don't keep activities" developer option enabled
- [ ] **Play Store listing**
  - [ ] Create store listing with description, screenshots, feature graphic
  - [ ] Complete content rating questionnaire
  - [ ] Set pricing (free) and distribution (all countries)
  - [ ] Submit for review

---

## PWA — Cross-Browser Compatibility

### Desktop Browsers
- [ ] **Chrome** (latest) — full test pass
- [ ] **Firefox** (latest) — full test pass
- [ ] **Safari** (latest, macOS) — full test pass
- [ ] **Edge** (latest) — full test pass

### Mobile Browsers
- [ ] **Chrome on Android** — test on at least one physical device
- [ ] **Safari on iOS** — test on at least one physical device

### Per-Browser Test Checklist
- [ ] File picker opens and works
- [ ] Wallet connection works (if wallet extension installed)
- [ ] QR code renders
- [ ] Theme toggle works
- [ ] Service worker registers (`Application > Service Workers` in DevTools)
- [ ] Offline fallback: go offline, navigate to `/create` — should show cached page
- [ ] Copy-to-clipboard works
- [ ] Keyboard navigation works
- [ ] No console errors

---

## PWA — Install & Update UX

- [ ] **Test install prompt** — PwaInstallPrompt component shows after ~5s on supported browsers
- [ ] **Test install flow** — Click "Install" → standard browser install prompt → app installs
- [ ] **Test "Not now"** — Dismisses the prompt; verify it doesn't reappear on same page load
- [ ] **Test update flow** — Deploy new version → verify "Update available" appears after SW update
- [ ] **Test cache migration** — Old cache (`openproof-v0.8.0` if exists) should be cleaned on SW activate
- [ ] **Test offline proof page** — Visit `/proof/placeholder` offline → should serve cached shell

---

## Domain & DNS

- [x] Cloudflare CNAME `proof → cname.vercel-dns.com` — DONE
- [x] Vercel domain `proof.kovina.org` registered — DONE
- [x] Canonical URLs updated in code — DONE
- [ ] Verify `https://proof.kovina.org` resolves and loads correctly
- [ ] Verify `https://openproof.vercel.app` redirects or still serves (it will — both work)

---

## v0.9.0 What Was Done (Automated)

These tasks were completed automatically this session:
- [x] Windows MSIX: Updated AppxManifest.xml version to 0.9.0.0
- [x] Windows MSIX: Generated splash screens (620x300, 868x420, 1116x540) with centered icon on black
- [x] PWA: Updated manifest theme_color to #0081CC (brand), background_color to #000000 (black)
- [x] PWA: Added `theme-color` meta tag to layout
- [x] PWA: Created `PwaInstallPrompt` component (beforeinstallprompt handling + update flow notification)
- [x] PWA: Added `/proof/` and `/bundle/` routes to SW static cache
- [x] Android: Initialized Capacitor project with `npx cap add android`
- [x] Android: Created `scripts/cap-build.sh` for static export + Capacitor sync
- [x] Android: Updated capacitor.config.json with 4 plugins (Filesystem, Keyboard, Share, SplashScreen)
- [x] Android: Dynamic routes support static export via `generateStaticParams`
- [x] Icons: All platform icons regenerated from canonical SVG
- [x] Footer: Version updated to v0.9.0
- [x] Lint: 0 errors (6 pre-existing warnings) ✅
- [x] Typecheck: Pass ✅
- [x] Build (Vercel mode): Pass ✅
- [x] Build (Capacitor static export): Pass ✅
- [x] Updated PLATFORM_READINESS.md to v0.9.0

---

## Reminders

- All icon files were regenerated from `public/icon.svg` (your SVG). If you update the SVG, run:
  ```bash
  node scripts/generate-icons.cjs   # all PNG variants
  node scripts/generate-ico.cjs     # ICO files + manifest
  ```
- Splash screens in `public/splash/` are pre-existing from v0.1.x. If they need updating to match your new icon, provide the splash source.
- The Vercel free tier has a 100-deploy-per-day limit. If you hit it, wait 24 hours or upgrade.
- Capacitor build: `npm run cap:build:android` to rebuild web assets and sync to Android project
- Contact for everything: sparshsam@gmail.com
