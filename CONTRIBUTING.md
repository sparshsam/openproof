# Contributing

Thanks for helping improve OpenProof.

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test:contracts
```

Keep the MVP zero-spend and privacy-first:

- Do not add server-side file uploads.
- Do not add paid storage or databases.
- Do not add IPFS to the MVP path.
- Do not commit private keys or deployed secrets.
- Keep contract changes small and covered by tests.

## Pull Requests

Include a short description, screenshots for UI changes, and the commands you ran. Security-sensitive changes should also update `SECURITY.md` or `docs/threat-model.md` when relevant.
