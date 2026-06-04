# OpenProof RFC Test Vectors

This directory is reserved for RFC-linked test vectors.

RFC-0001 references this directory as the canonical receipt test-vector
location. Before RFC-0001 reaches Frozen status, this directory must contain
fixtures for:

- Valid current receipt schema examples.
- Accepted legacy receipt examples.
- Malformed receipt examples.
- Bundle receipt examples.

This reservation does not introduce new receipt behavior. Receipt semantics
remain defined by `../RFC-0001-proof-receipt-format.md`,
`../../docs/receipt-schema.md`, and `../../src/lib/receipt.ts`.
