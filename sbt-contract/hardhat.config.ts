import * as dotenv from "dotenv";
dotenv.config({
  path: "../"
});

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {}
};

if (process.env.SEPOLIA_RPC_URL) {
  config.networks!.sepolia = {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.WALLET_PK!]
  };
}

export default config;
