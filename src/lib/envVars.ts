export function getEnvVar(name: keyof typeof ENVVARS): string {
  if (!process.env[name]) {
    throw new Error(`Please set the ${name} environment variable`);
  }

  return String(process.env[name]);
}

export const enum ENVVARS {
  RPC_PROVIDER = "RPC_PROVIDER",
  WALLET_PK = "WALLET_PK",
  SBT_CONTRACT = "SBT_CONTRACT",
  API_TOKEN = "API_TOKEN"
}
