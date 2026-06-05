# OpenProof Contributor Audit

**Date:** 2026-06-04
**Repository:** sparshsam/openproof
**Auditor:** OpenClaw Nexus
**Branch:** main (`26fcfb7`)

---

## 1. Contributor Mapping

| GitHub User | ID | Display Name | Commits | Role |
|-------------|-----|--------------|---------|------|
| `sparshsam` | 110058692 | Sparsh Sam | 22 | Owner, admin |
| `sparsh` | 2325566 | Sparsh Jain | 2 | Unintentional attribution |
| `dependabot[bot]` | 49699333 | Dependabot | 7 | Automated |

### Git Author Emails (All)

| Email | Author Name | Commits | GitHub Account |
|-------|-------------|---------|----------------|
| `110058692+sparshsam@users.noreply.github.com` | Sparsh Sam | 11 | `sparshsam` |
| `sparshsam@users.noreply.github.com` | sparshsam | 11 | `sparshsam` |
| `sparshsam@gmail.com` | Sparsh Sam | 3 | `sparshsam` |
| `sparsh@users.noreply.github.com` | Sparsh Sam | 2 | `sparsh` |
| `49699333+dependabot[bot]@users.noreply.github.com` | dependabot[bot] | 7 | `dependabot[bot]` |

---

## 2. Commit Attribution Breakdown

### `sparshsam` (22 commits)
Core implementation, all frontend work, architecture, documentation, contract, CI/CD.

### `sparsh` (2 commits) — Unintentional

| Commit | Date | Message |
|--------|------|---------|
| `33da3d3` | 2026-06-04 17:50 EDT | Add canonical receipt specification layer |
| `6f6a08a` | 2026-06-04 18:14 EDT | Merge commit '1ced016' (Sync OpenProof RFC layer) |

Both use author name "Sparsh Sam" — same as all other commits. The only difference is the email.

---

## 3. Root Cause Analysis

**Root cause: Local git config email mismatch.**

Sparsh Sam committed from a machine or terminal session where the git config `user.email` was set to `sparsh@users.noreply.github.com` instead of `sparshsam@users.noreply.github.com`.

On GitHub, the noreply email `sparsh@users.noreply.github.com` is associated with the GitHub account `sparsh` (Sparsh Jain, ID 2325566). GitHub automatically attributes commits with that email to the matching account.

The sequence:
1. Sparsh Sam authored and committed `33da3d3` locally with email `sparsh@users.noreply.github.com`
2. Created a merge commit `6f6a08a` with the same misconfigured email
3. GitHub matched the commit emails to the `sparsh` account and added them to the contributor list

This is **not**:
- An unauthorized external contributor
- A compromised credential
- A supply chain attack
- A malicious commit
- A rebase or cherry-pick from another user

It is a simple git config inconsistency — the `user.email` differed from the primary GitHub account's noreply address.

---

## 4. Security Assessment

**Repository is secure.** No integrity concerns.

| Check | Status |
|-------|--------|
| Unknown external collaborators | ✅ None — only `sparshsam` (admin) |
| Unauthorized commits | ✅ The 2 `sparsh` commits are from the same person (author name "Sparsh Sam", same contribution pattern) |
| Suspicious branches | ✅ None — all branches are dependabot or feature branches from `sparshsam` |
| Compromised tokens/actions | ✅ No unusual action runs, no suspicious workflow changes |
| Suspicious git metadata | ✅ No co-author injections, no rebase artifacts, no forced pushes |
| Branch protections | ✅ Push protected (branch rules bypass recorded but from legitimate pushes) |

The two commits attributed to `sparsh` contain the same author name, same commit style, same file changes as adjacent commits from `sparshsam`. They modify receipt specification and RFC synchronization documentation — consistent with the overall project trajectory.

**Verdict: Benign. No security action required.**

---

## 5. Recommended Cleanup

### Option A: Do Nothing (Recommended)

The two commits are structurally benign. GitHub shows `sparsh` as a contributor, but:
- The commits are from the same person (Sparsh Sam)
- The content is legitimate project work
- GitHub's contributor display does not grant any access or control
- No security boundary is crossed

**Pros:** Zero risk, no force-push needed, history preserved.

### Option B: Update Git Mailmap (Recommended If Cleanliness Matters)

Create a `.mailmap` file in the repo root to canonicalize the email:

```
Sparsh Sam <sparshsam@users.noreply.github.com> <sparsh@users.noreply.github.com>
```

This is a local mapping file — it changes how `git log` displays the author but does NOT rewrite history or change GitHub's contributor attribution. GitHub's "Contributors" graph reads the raw commit metadata and will still show `sparsh` for those 2 commits.

### Option C: History Rewrite (NOT Recommended)

Using `git filter-branch` or `git rebase` to change the author email. This would require a force-push that invalidates all existing clones, PRs, and CI caches. The benefit (cleaning 2 commit authors) does not justify the disruption.

### What Changed in the 2 Commits

The commits added:
- `docs/spec/receipt-specification.md` — canonical receipt specification document
- `docs/spec/openproof-test-vectors.md` — test vectors
- `docs/spec/openproof-receipt-schema.json` — JSON schema
- Various RFC synchronization updates

All standard documentation work — no code, no configuration, no secrets.

---

## 6. Summary

| Question | Answer |
|----------|--------|
| Who is `@sparsh`? | Sparsh Jain, a different GitHub user (ID 2325566) |
| How did they contribute? | They didn't — the attribution is accidental |
| Why does GitHub show them? | Git commit email `sparsh@users.noreply.github.com` matches their account |
| Was the repo compromised? | No |
| Were the commits authored by someone else? | No — same person (Sparsh Sam), wrong email config |
| Is action needed? | Not strictly required |
| Recommended action | Option A (do nothing) or Option B (add .mailmap) |
| Should history be rewritten? | No — not worth the disruption |

The `@sparsh` contributor is a benign attribution artifact from a local git config email mismatch. No external contributor pushed code to this repository.
