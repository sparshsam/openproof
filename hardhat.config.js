require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
    },
  },
};

module.exports = config;
