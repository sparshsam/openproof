// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.24;

contract OpenProofRegistry {
    struct Proof {
        address creator;
        uint64 timestamp;
        bytes32 fileHash;
    }

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
