# OpenProof Branding

## Kovina Ecosystem Hierarchy

```
Kovina (umbrella / parent brand)
├── Open Product Family
│   ├── OpenPalette (design system — canonical reference)
│   ├── OpenSend (mobile file transfer)
│   ├── OpenProof (onchain proof of existence)
│   ├── OpenReader (desktop PDF utility)
│   └── [future open apps]
└── Other Kovina properties
```

Kovina is the parent brand operating at **kovina.org**.
Each Open app lives at a branded subdomain (**proof.kovina.org**, etc.).

---

## Open Product Family Hierarchy

```
OPEN <ProductName>
  │
  ├── OPEN is the family identifier — never an icon, never a logo
  ├── ProductName is the individual app name
  └── Lockup: [app icon] OPEN / ProductName
```

**OPEN has no icon.** Only the individual product has an icon. The lockup places the product icon next to the stacked OPEN / ProductName typography:

```
[shield icon]
OPEN
Proof
```

The icon belongs to the product (Proof), not to the OPEN family identifier.

---

## OpenProof Branding

| Property | Value |
|----------|-------|
| **Full name** | OpenProof |
| **Domain** | proof.kovina.org |
| **Parent** | Kovina / Open Product Family |
| **Accent color** | `#0081CC` |
| **Icon** | Shield with checkmark (`public/icon.svg`) |
| **Sans font** | Stack Sans Notch |
| **Mono font** | Geist Mono |
| **Tagline** | Proof without surrender. |
| **Core metaphor** | Proof terminal / receipt printer |
| **Emotional tone** | Calm, infrastructural |

### Header lockup (reference implementation)

```tsx
<Link href="/" className="flex items-center gap-1.5 group shrink-0" aria-label="OpenProof home">
  <img alt="" className="size-7 sm:size-8" src="/icon.svg" />
  <div className="flex flex-col leading-tight">
    <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-muted opacity-50">
      OPEN
    </span>
    <span className="text-sm sm:text-[15px] font-medium text-text-primary group-hover:text-accent transition-colors -mt-0.5">
      Proof
    </span>
  </div>
</Link>
```

### Rules

1. **OPEN never has an icon.** The shield icon is OpenProof's, not OPEN's.
2. Never merge the icon with typography. The icon and the wordmark are separate elements.
3. "OpenProof" remains the application name in code, metadata, SEO, and docs.
4. The lockup pattern is for the header only. Other references use the full name "OpenProof".
5. Responsive: icon is `size-7` on mobile, `size-8` on desktop.

---

## OpenPalette — Canonical Reference

> OpenPalette is the canonical reference for Open Product Family branding.
> All Open apps should reference OpenPalette before making brand decisions.

OpenPalette defines:
- The OPEN / ProductName lockup pattern
- Color system and accent usage
- Typography standards (Stack Sans Notch + Geist Mono)
- Spacing and layout conventions
- Icon standards

Refer to the OpenSend implementation for the most current lockup code pattern.

---

## Design History

- **v0.9.0**: Original header used `[shield icon] OpenProof` wordmark
- **v0.9.1**: Aligned with Open Product Family — header now uses `[shield icon] OPEN / Proof` lockup
