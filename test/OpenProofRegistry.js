const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenProofRegistry", function () {
  async function deployRegistry() {
    const [creator, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("OpenProofRegistry");
    const registry = await Registry.deploy();
    return { creator, other, registry };
  }

  const fileHash =
    "0x8b6f2b9c3b1e4f6c8897d29d39e45e4ff34b955cf9e693c8127a92f8ac7f54a1";

  it("registers a proof", async function () {
    const { creator, registry } = await deployRegistry();

    await expect(registry.registerProof(fileHash))
      .to.emit(registry, "ProofRegistered")
      .withArgs(fileHash, creator.address, anyValue);

    expect(await registry.proofExists(fileHash)).to.equal(true);
  });

  it("prevents duplicate registration", async function () {
    const { other, registry } = await deployRegistry();

    await registry.registerProof(fileHash);
    await expect(registry.connect(other).registerProof(fileHash))
      .to.be.revertedWithCustomError(registry, "ProofAlreadyRegistered")
      .withArgs(fileHash);
  });

  it("reads a proof", async function () {
    const { creator, registry } = await deployRegistry();

    await registry.registerProof(fileHash);
    const proof = await registry.getProof(fileHash);

    expect(proof.creator).to.equal(creator.address);
    expect(proof.fileHash).to.equal(fileHash);
    expect(proof.timestamp).to.be.greaterThan(0);
  });

  it("checks nonexistent proof", async function () {
    const { registry } = await deployRegistry();
    const missingHash =
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    expect(await registry.proofExists(missingHash)).to.equal(false);
    await expect(registry.getProof(missingHash))
      .to.be.revertedWithCustomError(registry, "ProofNotFound")
      .withArgs(missingHash);
  });

  it("reports registry version", async function () {
    const { registry } = await deployRegistry();
    expect(await registry.registryVersion()).to.equal(2);
  });
});
