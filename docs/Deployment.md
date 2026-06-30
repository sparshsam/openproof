# Deployment

OpenProof deploys as a static Next.js app with no backend services required.

## Deploy to Vercel

1. Fork or clone this repository.
2. Import it into [Vercel](https://vercel.com).
3. Add the public environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID=84532`
   - `NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS`
4. Deploy with the default Next.js settings.

No paid domain, database, storage bucket, file uploads, or IPFS pinning service is required for the MVP.

## Contract Deployment

```bash
npm run compile
npm run test:contracts
npm run deploy:base-sepolia
```

Contract deployment requires `BASE_SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` in `.env`.

For additional deployment notes, see [`docs/deployment-notes.md`](deployment-notes.md).
