# OpenProof PWA Tab Restructure

Date: 2026-07-05
Status: Approved

## Problem

1. WagmiProviderNotFoundError on Create/Verify pages in PWA mode. `WalletProvider` lives in `AppShell` but PWA mode uses `PwaShell` which lacks it.
2. `/app` homepage has a splash screen + action cards + history + testnet notice — too much for a focused app.
3. About / Privacy / Terms are only accessible on the website, not inside the PWA.
4. Each PWA tab should open directly to its functional content.

## Solution

### 1. Move WalletProvider to root layout

`WalletProvider` moves from `AppShell` → root `layout.tsx`, wrapping `ConditionalShell`. Removed from `AppShell` to prevent nesting. Fixes wagmi context for all routes in both PWA and browser mode.

### 2. Tab routing

| Tab | Route | Content |
|-----|-------|---------|
| **Create** | `/app` | App title + one-line summary + full create-proof flow |
| **Verify** | `/app/verify` | Full verify-proof flow |
| **History** | `/app/history` | Proof history + bundle proofs + testnet notice |
| **More** | `/app/more` | About, Privacy, Terms, Docs links |

### 3. Page changes

- **`/app/page.tsx`**: Remove `AppSplash`, remove action cards. Show "Create Proof" title + summary + redirect to or embed the create flow from `/create`.
- **`/app/history/page.tsx`**: Add bundle proofs card + testnet notice (moved from `/app/page.tsx`).
- **`/app/more/page.tsx`**: Expand with proper sections linking to About, Privacy, Terms, Docs page content.
- **`/app/verify/page.tsx`**: Currently redirects to `/verify`. Change to embed the full verify flow from `/verify`.

### 4. Wallet provider architecture

```
Root layout
├── Script (theme)
├── Script (SW)
├── WalletProvider          ← MOVED HERE
│   └── ThemeProvider
│       └── ConditionalShell
│           ├── PwaShell (PWA mode, all routes)
│           └── AppShell (browser mode, non-/app routes)
```

### 5. No layout duplication

- `/create` and `/verify` standalone pages keep working via their existing layout chain.
- `/app/*` PWA routes use `PwaShell` via `ConditionalShell`.
- Shared wallet context at root level means components using `useAccount()`, `usePublicClient()`, etc. work everywhere.

### 6. Desktop and mobile parity

Same structure on both. No splash screen. Each tab opens directly to its functional content.
