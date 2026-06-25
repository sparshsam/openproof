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
  - Run the Windows App Certification Kit on the project
  - Package `public/` static export into MSIX using AppxManifest.xml in `assets/windows/`
  - Sign the package with a code signing certificate
- [ ] **Test keyboard shortcuts on Windows**
  - Tab through all pages (Create, Verify, About, Proof explorer)
  - Enter/Escape on buttons and dialogs
  - Ensure skip-to-content link works
- [ ] **Test window resize behavior**
  - Test at 800px, 1024px, 1280px, 1440px+ widths
  - Verify nav collapses to mobile menu at small widths
  - Verify no horizontal scrollbars at any width
- [ ] **Windows Store validation**
  - Submit the signed MSIX to Partner Center
  - Complete the Store listing (description, screenshots, category, age rating)
  - Pass Windows App Certification Kit tests

---

## ANDROID — Capacitor / Play Store

### Prerequisites
- [ ] Android Studio installed (with Android SDK)
- [ ] Google Play Console account ($25 one-time fee)
- [ ] Java 17+ for Android builds

### Tasks
- [ ] **Initialize Capacitor Android project**
  ```bash
  npx cap add android
  ```
- [ ] **Test share sheet**
  - Share a proof URL from the app to other apps (Messages, Email, Notes)
  - Verify the URL is correct (`https://proof.kovina.org/proof/<hash>`)
- [ ] **Test file picker on Android**
  - Select files from Downloads, Gallery, Google Drive picker
  - Select multiple files for bundle proofs
  - Verify large files work (up to 100MB)
- [ ] **Test background restrictions (Android 12+)**
  - Enable battery optimization for the app
  - Put app in background, verify it returns to correct state
  - Test with "Don't keep activities" developer option enabled
- [ ] **Generate signed AAB**
  ```bash
  npx cap build android
  ```
  - Sign with your Play Store upload key
  - Test the AAB on a physical device or emulator
- [ ] **Play Store listing**
  - Create store listing with description, screenshots, feature graphic
  - Complete content rating questionnaire
  - Set pricing (free) and distribution (all countries)
  - Submit for review

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

## Domain & DNS

- [x] Cloudflare CNAME `proof → cname.vercel-dns.com` — DONE
- [x] Vercel domain `proof.kovina.org` registered — DONE
- [x] Canonical URLs updated in code — DONE
- [ ] Verify `https://proof.kovina.org` resolves and loads correctly
- [ ] Verify `https://openproof.vercel.app` redirects or still serves (it will — both work)

---

## Reminders

- All icon files were regenerated from `public/icon.svg` (your SVG). If you update the SVG, run:
  ```bash
  node scripts/generate-icons.cjs   # all PNG variants
  node scripts/generate-ico.cjs     # ICO files + OG + manifest
  ```
- Splash screens in `public/splash/` are pre-existing from v0.1.x. If they need updating to match your new icon, provide the splash source.
- The Vercel free tier has a 100-deploy-per-day limit. If you hit it, wait 24 hours or upgrade.
- Contact for everything: sparshsam@gmail.com
