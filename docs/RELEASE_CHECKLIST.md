# OpenProof Release Validation Checklist

## Full Manual Regression

### Core Proof Loop
- [ ] File selection (single file)
- [ ] File selection (bundle / multiple files)
- [ ] Local SHA-256 hashing completes
- [ ] Connect wallet flow
- [ ] Wallet chain switch (wrong chain → correct chain)
- [ ] Proof registration transaction
- [ ] Transaction confirmation receipt
- [ ] Receipt auto-download
- [ ] Receipt JSON is valid and complete
- [ ] Receipt contains all v3 fields
- [ ] Proof history entry created
- [ ] Bundle manifest stored in localStorage
- [ ] Verify proof: file → hash → onchain check
- [ ] Verify proof: receipt import → schema check → onchain check
- [ ] Proof confirmed / not-found / error states all render

### Bundle Proofs
- [ ] Multi-file bundle selection
- [ ] Bundle Merkle root computed
- [ ] Bundle receipt generated
- [ ] Bundle explorer page loads at `/bundle/[hash]`
- [ ] Bundle file listing renders
- [ ] "Verify inclusion" button works for each file
- [ ] Bundle manifest downloadable

### Proof Explorer
- [ ] `/proof/[hash]` loads with valid hash
- [ ] Invalid hash shows error state
- [ ] Missing proof shows not-found state
- [ ] All 6 onchain fields display (fingerprint, timestamp, wallet, network, block, tx)
- [ ] Bundle awareness link shows when bundle manifest exists
- [ ] QR code renders and downloads
- [ ] Copy buttons work

### Navigation & UI
- [ ] All nav links work (Create, Verify, About, GitHub)
- [ ] Theme toggle switches dark/light
- [ ] Theme persists across page reload
- [ ] Skip-to-content link works
- [ ] Footer links work (About, Privacy, Terms, GitHub)

### Error States
- [ ] Wallet not connected: appropriate messaging
- [ ] Wrong chain: switch prompt
- [ ] RPC failure: graceful error message
- [ ] Duplicate proof detection
- [ ] Receipt import: malformed JSON error
- [ ] Receipt import: wrong contract error
- [ ] Receipt import: wrong chain error
- [ ] Receipt import: hash not found error
- [ ] Empty bundle: validation error
- [ ] File too large: limit enforcement

## Cross-Browser Regression

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome on Android
- [ ] Safari on iOS

### Per-Browser Checks
- [ ] File picker opens
- [ ] Wallet connection works
- [ ] QR code renders
- [ ] Theme toggle works
- [ ] Service worker registers
- [ ] Offline fallback serves cached pages
- [ ] Copy-to-clipboard works
- [ ] Keyboard navigation works

## Mobile Regression

### iOS
- [ ] PWA install prompt (Share → Add to Home Screen)
- [ ] Standalone mode: no browser chrome
- [ ] Safe area rendering (notch, home indicator)
- [ ] Touch targets ≥ 44px
- [ ] Zoom disabled on input focus
- [ ] Keyboard doesn't break layout
- [ ] File picker from camera roll
- [ ] Share sheet integration

### Android
- [ ] PWA install prompt (Chrome banner)
- [ ] Standalone mode
- [ ] Status bar color matches theme
- [ ] Back button navigation works
- [ ] File picker from gallery/files
- [ ] Share sheet integration
- [ ] Adaptive icon renders correctly

## Accessibility Audit

- [ ] Skip-to-content link visible on focus
- [ ] All images have alt text
- [ ] All buttons have accessible labels
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation: all pages reachable
- [ ] Screen reader: headings follow hierarchy
- [ ] Screen reader: status updates announced (aria-live)
- [ ] Reduced motion respected
- [ ] Touch target minimum 44×44px

## Lighthouse 100 Pass

- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90
- [ ] PWA installable
- [ ] PWA registers service worker
- [ ] No console errors
- [ ] No deprecated APIs

## Store Package Validation

- [ ] PWA manifest validates
- [ ] All icon sizes present (192, 512)
- [ ] Screenshots present (wide + narrow)
- [ ] Service worker registers and caches
- [ ] Static export builds without errors
- [ ] Security headers present in vercel.json
- [ ] robots.txt and sitemap.xml present
- [ ] OG image renders in social preview
- [ ] Apple touch icon renders
- [ ] Splash screens render
