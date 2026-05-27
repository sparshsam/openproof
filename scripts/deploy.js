const { ethers } = require("hardhat");

async function main() {
  const Registry = await ethers.getContractFactory("OpenProofRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`OpenProofRegistry deployed to ${address}`);
  console.log("Set NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS to this address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
