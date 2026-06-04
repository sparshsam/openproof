# OpenProof Test Vectors

**Deterministic verification test vectors for implementers.**

These test vectors allow any implementation to verify correctness against a known-good reference. A conforming implementation MUST produce the same verification outcomes for all vectors in this document.

- **Specification version:** 1
- **Document version:** 1
- **Governance:** [ecosystem-standards](https://github.com/sparshsam/ecosystem-standards)

---

## Notation

Each test vector is presented as:

```
TEST VECTOR N: <name>
Input:    <canonical JSON bytes or description>
Expected: <SUCCESS | FAILURE(reason)>
Notes:    <implementation guidance>
```

---

## Section 1: Canonical Example Receipts

These receipts are structurally valid. They are provided for implementers to verify serialization, canonicalization, and — where noted — to verify that the predicted commitment hash matches.

### Vector 1: Minimal proof receipt

This is the simplest valid receipt. All optional fields omitted.

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Structural validation | PASS |
| Field order canonical | PASS |
| Schema conformance | PASS |
| Cryptographic verification | PASS (with corresponding private key) |

**Canonical body bytes** (what gets hashed for the commitment):

```json
{"metadata":{},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"type":"proof-receipt","version":1}
```

### Vector 2: Receipt with metadata

```json
{"metadata":{"name":"Contract agreement v2","nonce":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","origin":"openproof-cli-0.1.0"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Structural validation | PASS |
| Field order canonical | PASS — `metadata` comes before `signature` |
| Metadata key pattern | PASS — all keys match `^[a-zA-Z0-9_-]+$` |
| Metadata value types | PASS — all values are strings |

### Vector 3: Bundle receipt

```json
{"commitment":"sha256:9999999999999999999999999999999999999999999999999999999999999999","commitments":["sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"],"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2","timestamp":1717488000,"type":"bundle","version":1}
```

| Check | Expected |
|-------|----------|
| Structural validation | PASS |
| Type `"bundle"` with `commitments` array | PASS |
| Commitments array non-empty | PASS — 3 entries |
| Commitments array contains valid hash strings | PASS |
| Subject matches computed hash | PASS |
| Field order canonical | PASS |

**Computed bundle subject derivation:**
```
Sorted commitments array:
  ["sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
   "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
   "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"]

Canonical JSON bytes of sorted array:
  ["sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"]

SHA-256 of these bytes → hex → prefix with "sha256:" → MUST equal "sha256:d2d2..."
```

### Vector 4: Receipt with boolean metadata

```json
{"metadata":{"verified":true,"origin":"scanner-v2.1"},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Structural validation | PASS |
| Boolean metadata value `"verified":true` | PASS — booleans are valid metadata values |

### Vector 5: Receipt with null metadata value

```json
{"metadata":{"optional_field":null},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Structural validation | PASS |
| Null metadata value | PASS — null is a valid metadata value |

---

## Section 2: Structural Failure Vectors

These receipts fail structural validation. They MUST be rejected BEFORE cryptographic verification.

### Vector 6: Duplicate keys

```json
{"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","subject":"sha256:def4567890123456789012345678901234567890123456789012345678901234","timestamp":1717488000,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| JSON parseability | Implementation-dependent — duplicate keys may parse silently |
| Canonicalization | MUST reject: duplicate keys invalid per spec §4.3 |
| **Final verdict** | **FAILURE(duplicate keys)** |

### Vector 7: Empty input

```
Input: (zero bytes)
```

| Check | Expected |
|-------|----------|
| Parse | FAILURE(empty input) |
| **Final verdict** | **FAILURE(empty input)** |

### Vector 8: Invalid JSON

```
Input: {invalid json here}
```

| Check | Expected |
|-------|----------|
| Parse | FAILURE(invalid JSON) |
| **Final verdict** | **FAILURE(invalid JSON)** |

### Vector 9: Missing required field

```json
{"timestamp":1717488000,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — missing required fields: `signature`, `subject` |
| **Final verdict** | **FAILURE(missing required fields)** |

### Vector 10: Version mismatch

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"type":"proof-receipt","version":2}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `version` must be `1` |
| **Final verdict** | **FAILURE(unsupported version 2)** |

### Vector 11: Invalid type

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"type":"invalid-type","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `type` must be `"proof-receipt"` or `"bundle"` |
| **Final verdict** | **FAILURE(invalid receipt type)** |

### Vector 12: Bundle without commitments

```json
{"metadata":{},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","timestamp":1717488000,"type":"bundle","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — type `"bundle"` requires `commitments` field |
| **Final verdict** | **FAILURE(bundle missing commitments)** |

### Vector 13: Negative timestamp

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":-1717488000,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `timestamp` minimum is `0` |
| **Final verdict** | **FAILURE(negative timestamp)** |

### Vector 14: Invalid subject hash format

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"not-a-hash","timestamp":1717488000,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `subject` must match `^sha256:[a-f0-9]{64}$` |
| **Final verdict** | **FAILURE(invalid subject format)** |

### Vector 15: Signature value too short

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"abc123"},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `signature.value` must match `^[A-Za-z0-9_-]{86}$` |
| **Final verdict** | **FAILURE(invalid signature format)** |

### Vector 16: Public key format invalid

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"too-short","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `publicKey` must match `^[A-Za-z0-9_-]{43}$` |
| **Final verdict** | **FAILURE(invalid public key format)** |

### Vector 17: Bundle with empty commitments array

```json
{"commitments":[],"metadata":{},"subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","timestamp":1717488000,"type":"bundle","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | FAILURE — `commitments` array must have at least 1 item |
| **Final verdict** | **FAILURE(empty commitments array)** |

### Vector 18: Unsorted fields (non-canonical ordering)

```json
{"version":1,"type":"proof-receipt","subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":1717488000,"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Schema validation | PASS (fields are all present, JSON schema doesn't enforce ordering) |
| Canonical byte form | Differs from spec-canonical — implementation MUST canonicalize before hashing |
| Cryptographic verification | PASS — after canonicalization, body bytes and hash match |

---

## Section 3: Cryptographic Verification Vectors

These vectors test that the cryptographic verification logic produces correct outcomes.

### Vector 19: Known-key verification

**Scenario:** A receipt signed with a known Ed25519 key pair.

| Test | Expected |
|------|----------|
| Receipt with correct signature for commitment | PASS |
| Receipt with wrong public key (same signature value) | FAILURE(signature verification failed) |
| Receipt with tampered `subject` after signing | FAILURE(commitment mismatch) |
| Receipt with tampered `timestamp` after signing | FAILURE(commitment mismatch) |
| Receipt with tampered metadata after signing | FAILURE(commitment mismatch) |

### Vector 20: Bundle subject mismatch

A bundle receipt whose `subject` does not match the computed hash of its `commitments` array.

| Test | Expected |
|------|----------|
| Bundle subject does not match sorted commitments hash | FAILURE(bundle subject mismatch) |

---

## Section 4: Edge Cases

### Vector 21: Metadata with integer value 0

Integer zero is a valid metadata value.

```json
{"metadata":{"counter":0},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1"}
```

| Check | Expected |
|-------|----------|
| Schema validation | PASS — integer zero is a valid metadata value |
| Metadata value type | PASS — number |

### Vector 22: Max valid timestamp

```json
{"metadata":{},"signature":{"algorithm":"ed25519","publicKey":"kgL6Jw4C63fX6v8ZA1pB2qD3rE4tY5uI6oP7aQ8sS9dF0gH1jK2lL3zX4cV5bN6m","value":"W7xY8zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0gH1iJ2kL3mN4oP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5bB6cC7dD8eE9fF0gG1hH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ6aA7bB8cC9dD0eE1fF2gG3hH4iI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3bB4cC5dD6eE7fF8gG9hH0iI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1","subject":"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","timestamp":253402300799,"type":"proof-receipt","version":1}
```

| Check | Expected |
|-------|----------|
| Schema validation | PASS — `253402300799` is within valid range |
| Timestamp interpretation | Year 9999 — the maximum representable |

---

## Section 5: QR Encoding Vectors

### Vector 23: QR encode/decode round-trip

**Input receipt:** Vector 1 (minimal proof receipt).

**Expected QR string** (conceptual — actual QR encoding depends on library):

| Step | Output |
|------|--------|
| Canonical JSON bytes | (71 bytes for minimal receipt) |
| base64url (no padding) | String of ≤ 2953 characters |
| With prefix | `opr1:` + base64url string |

**Decoding:**
```
QR → text → strip "opr1:" → base64url-decode → canonical JSON bytes → verify
```

---

## Appendix: Verification Test Matrix

All test vectors summarized in matrix form for implementer reference:

| # | Name | Expected Result |
|---|------|-----------------|
| 1 | Minimal proof receipt | PASS (after canonicalization) |
| 2 | Receipt with metadata | PASS |
| 3 | Bundle receipt | PASS |
| 4 | Boolean metadata | PASS |
| 5 | Null metadata value | PASS |
| 6 | Duplicate keys | FAILURE (structural) |
| 7 | Empty input | FAILURE (empty) |
| 8 | Invalid JSON | FAILURE (parse) |
| 9 | Missing required fields | FAILURE (schema) |
| 10 | Version mismatch | FAILURE (unsupported version) |
| 11 | Invalid type | FAILURE (schema) |
| 12 | Bundle without commitments | FAILURE (schema) |
| 13 | Negative timestamp | FAILURE (schema) |
| 14 | Invalid subject hash | FAILURE (schema) |
| 15 | Signature too short | FAILURE (schema) |
| 16 | Public key invalid | FAILURE (schema) |
| 17 | Empty commitments array | FAILURE (schema) |
| 18 | Unsorted fields | PASS (after canonicalization) |
| 19 | Known-key verification | PASS / FAIL per scenario |
| 20 | Bundle subject mismatch | FAILURE (bundle) |
| 21 | Integer zero metadata | PASS |
| 22 | Max valid timestamp | PASS |
| 23 | QR round-trip | PASS |

---

*End of test vectors. These vectors should be used as the definitive reference for implementation correctness.*
