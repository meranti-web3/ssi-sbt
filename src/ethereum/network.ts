import { Wallet, providers } from "ethers";
import { ENVVARS, getEnvVar } from "../lib/envVars";

export const provider = new providers.JsonRpcProvider(getEnvVar(ENVVARS.RPC_PROVIDER));

export const ownerWallet = new Wallet(getEnvVar(ENVVARS.WALLET_PRIVATE_KEY), provider);
