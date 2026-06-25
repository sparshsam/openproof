// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.24;

/// @title OpenProofRegistry v2
/// @notice Minimal proof-of-existence registry with registry version support.
/// @dev v2: Added registryVersion constant for v3 receipt compatibility.
contract OpenProofRegistry {
    struct Proof {
        address creator;
        uint64 timestamp;
        bytes32 fileHash;
    }

    /// @notice Current registry version. Incremented on contract upgrades
    ///         that change proof semantics. Used in v3+ receipt metadata.
    uint256 public constant registryVersion = 2;

    error EmptyFileHash();
    error ProofAlreadyRegistered(bytes32 fileHash);
    error ProofNotFound(bytes32 fileHash);

    event ProofRegistered(
        bytes32 indexed fileHash,
        address indexed creator,
        uint64 timestamp
    );

    mapping(bytes32 => Proof) private proofs;

    function registerProof(bytes32 fileHash) external {
        if (fileHash == bytes32(0)) revert EmptyFileHash();
        if (proofs[fileHash].timestamp != 0) {
            revert ProofAlreadyRegistered(fileHash);
        }

        uint64 timestamp = uint64(block.timestamp);
        proofs[fileHash] = Proof({
            creator: msg.sender,
            timestamp: timestamp,
            fileHash: fileHash
        });

        emit ProofRegistered(fileHash, msg.sender, timestamp);
    }

    function getProof(bytes32 fileHash) external view returns (Proof memory) {
        Proof memory proof = proofs[fileHash];
        if (proof.timestamp == 0) revert ProofNotFound(fileHash);
        return proof;
    }

    function proofExists(bytes32 fileHash) external view returns (bool) {
        return proofs[fileHash].timestamp != 0;
    }
}
