# OpenProof RFC Terminology

This document records shared terminology used across the OpenProof RFC layer.
Individual RFCs may define additional terms for local use.

## Shared Terms

| Term | Definition |
|------|------------|
| Artifact | A file, document, data object, or bundle member being proven. |
| Backend minimization | The constraint that remote services may transport, publish, or retrieve proof metadata but must not be required as verification authorities when local evidence is available. |
| Bundle | A collection of one or more member artifacts proven together. |
| Canonical bytes | The exact byte sequence used as input to a digest operation. |
| Digest | A hash value computed over canonical bytes using the declared algorithm. |
| Implementation neutrality | The constraint that RFCs specify interoperable behavior without requiring a particular programming language, framework, vendor, deployment model, or hosted service. |
| Local-first verification | Verification performed from locally available receipts and artifact bytes without account login, telemetry submission, or backend state. |
| Proof receipt | A structured record containing verification metadata for an artifact or bundle. |
| Public proof page | A web page that exposes receipt metadata for inspection or retrieval without acting as a trust root. |
| QR payload | The string encoded in a QR code for receipt retrieval or inline receipt transport. |
| Trust boundary | A boundary between data used as evidence and data used only as transport, presentation, or descriptive metadata. |
| Verifier | Software that evaluates proof metadata against supplied artifacts or receipt metadata. |

## Terminology Corrections Applied

The refinement pass corrected `inline receipt` in RFC-0005 to mean receipt JSON
carried directly in the QR payload. Compression is not specified by RFC-0005.
