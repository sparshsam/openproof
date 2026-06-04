# Contributing OpenProof RFCs

OpenProof RFC contributions are governed by the ecosystem standards repository:

https://github.com/sparshsam/ecosystem-standards

Contributors MUST read the ecosystem RFC standard, repository doctrine,
documentation standard, public/private boundary standard, and maturity model
before proposing an OpenProof RFC.

## Contribution Requirements

An OpenProof RFC contribution MUST:

- Use the template in `rfcs/templates/RFC-0000-template.md`.
- Declare status, author, date, and intended scope.
- Preserve deterministic behavior.
- Preserve local-first operation.
- Preserve backend minimization.
- Preserve implementation neutrality.
- Preserve portability and archival friendliness.
- Include failure modes, privacy considerations, security considerations, and
  explicit non-goals.
- Use restrained infrastructure language.

## Prohibited Content

An OpenProof RFC MUST NOT introduce:

- Token systems.
- Repository-local governance mechanics.
- Social trust systems.
- Telemetry requirements.
- AI scoring.
- Cloud dependency requirements.
- Engagement systems.
- Enterprise procurement or administrative bloat.
- Roadmap speculation.
- Product or startup language.

## Review Checklist

Reviewers SHOULD verify:

- The RFC does not conflict with ecosystem standards.
- The RFC is testable without private implementation knowledge.
- All deterministic guarantees are stated precisely.
- The privacy model does not require unnecessary data collection.
- Verification can be performed locally where artifacts are available.
- Any backend use is optional, minimal, and explicitly bounded.
- Unknown fields and older versions have defined behavior.
- Failure modes do not require silent acceptance.

## Amendments

Minor amendments may be proposed against an existing RFC when they clarify text
without changing behavior. Behavior-changing amendments require lifecycle
review as defined in `RFC-LIFECYCLE.md`.

## Supersession

A replacement specification MUST be proposed as a new RFC. The older RFC MUST
remain available for archival reference and MUST identify its replacement.
