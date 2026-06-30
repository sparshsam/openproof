# Testing

Run these checks before submitting a pull request:

## Lint

```bash
npm run lint
```

Runs ESLint across the codebase.

## TypeScript Type Checking

```bash
npm run typecheck
```

Ensures all TypeScript types are correct.

## Production Build

```bash
npm run build
```

Verifies the Next.js app builds without errors.

## Contract Tests

```bash
npm run test:contracts
```

Runs Hardhat tests for the Solidity registry contract.

## All Checks in One Command

```bash
npm run lint && npm run typecheck && npm run build && npm run test:contracts
```
