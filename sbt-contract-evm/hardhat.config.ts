import * as dotenv from "dotenv";
dotenv.config({
  path: "../.env"
});

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
  }
};

if (process.env.RPC_URL) {
  config.networks!.deployNetwork = {
    url: process.env.RPC_URL,
    accounts: [process.env.WALLET_PRIVATE_KEY!]
  };
}

export default config;
