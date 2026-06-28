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

## WEBSITE COPY REVIEW (NEW)

From latest session:
- [ ] **Review homepage copy** — Verify all 6 sections render correctly:
      1. Hero ("Proof without surrender.")
      2. Who uses OpenProof (8 audiences)
      3. How it works (3 steps)
      4. When to timestamp (4 scenarios)
      5. What a proof means (proves vs doesn't prove)
      6. Privacy by design (4 pillars)
- [ ] **Review About page** — New "Who uses" and "When to use" sections
- [ ] **Review Create/Verify pages** — Updated header copy
- [ ] **Check for hydration errors** — Open DevTools Console, should be clean
- [ ] **Check offline notice** — Should NOT appear on localhost
- [ ] **Deploy to production** — Push latest changes to main triggers Vercel deploy
- [ ] **Verify production** — Visit https://proof.kovina.org, check copy and console

---

## DOMAIN & DNS

- [x] Cloudflare CNAME `proof → cname.vercel-dns.com` — DONE
- [x] Vercel domain `proof.kovina.org` registered — DONE
- [x] Canonical URLs updated in code — DONE
- [ ] Verify `https://proof.kovina.org` resolves and loads correctly
- [ ] Verify `https://openproof.vercel.app` redirects or still serves (it will — both work)

---

## v0.9.0 — Completed (Automated)

- [x] Windows MSIX: AppxManifest.xml v0.9.0.0, splash screens (620×300, 868×420, 1116×540)
- [x] PWA: manifest theme #0081CC, background #000000, theme-color meta tag
- [x] PWA: PwaInstallPrompt component (beforeinstallprompt + update notification)
- [x] PWA: SW cache extended to /proof/ and /bundle/ routes
- [x] Android: Capacitor project initialized, build script created, 4 plugins configured
- [x] Website copy: Homepage rewritten with 6 sections, About page enhanced, SEO metadata enriched
- [x] Hydration fix: suppressHydrationWarning on <html>, offline hook rewritten with useSyncExternalStore
- [x] Icons: All platform variants regenerated from SVG
- [x] Version references: Footer, create page, about page all v0.9.0
- [x] Lint / typecheck / build: All passing

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
