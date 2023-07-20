export function getEnvVar(name: keyof typeof ENVVARS): string {
  if (!process.env[name]) {
    throw new Error(`Please set the ${name} environment variable`);
  }

  return String(process.env[name]);
}

export const enum ENVVARS {
  RPC_PROVIDER = "RPC_PROVIDER",
  WALLET_PRIVATE_KEY = "WALLET_PRIVATE_KEY",
  SBT_CONTRACT = "SBT_CONTRACT",
  API_KEY = "API_KEY",

  // ethereum
  ETHEREUM_RPC_URL = "ETHEREUM_RPC_URL",
  ETHEREUM_SBT_CONTRACT = "ETHEREUM_SBT_CONTRACT",

  // tezos
  TEZOS_RPC_URL = "TEZOS_RPC_URL",
  TEZOS_WALLET_PRIVATE_KEY = "TEZOS_WALLET_PRIVATE_KEY",
  TEZOS_SBT_WALLET_ADDRESS = "TEZOS_SBT_WALLET_ADDRESS",
  TEZOS_SBT_CONTRACT_ADDRESS = "TEZOS_SBT_CONTRACT_ADDRESS"
}
