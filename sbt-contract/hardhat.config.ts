import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "fantomtestnet",
  networks: {
    fantomtestnet: {
      url: process.env.TESTNET_RPC_URL,
      accounts: [process.env.TESTNET_SIGNER_PRIVATEKEY!]
    }
  }
};

export default config;
