import { Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ENVVARS, getEnvVar } from "./envVars";

export const provider = new JsonRpcProvider(getEnvVar(ENVVARS.RPC_PROVIDER));

export const ownerWallet = new Wallet(getEnvVar(ENVVARS.WALLET_PK), provider);
