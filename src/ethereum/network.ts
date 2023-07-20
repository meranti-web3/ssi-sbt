import { Wallet, JsonRpcProvider } from "ethers";
import { ENVVARS, getEnvVar } from "../lib/envVars";

export function createOwnerWallet(rpcProvider: string) {
  const provider = new JsonRpcProvider(rpcProvider);

  return new Wallet(getEnvVar(ENVVARS.WALLET_PRIVATE_KEY), provider);
}
