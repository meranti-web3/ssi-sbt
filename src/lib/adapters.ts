import { getSoulboundTokenContract } from "../ethereum/soulboundTokens";
import EthereumAdapter from "../ethereum/ethereum";
import { ClientError } from "./errors";
import TezosAdapter from "../tezos/tezos";
import { tezos } from "../tezos/network";
import { ENVVARS, getEnvVar } from "./envVars";
import { createOwnerWallet } from "../ethereum/network";

export type transactionHash = string;

interface AdapterInfo {
  network: unknown;
  contract_address: string;
  name: string;
  symbol: string;
}

export interface BlockchainAdapter {
  getContractAddress(): Promise<string>;
  getBalanceOf(owner: string): Promise<number>;
  mint(owner: string, ipfs_url: string): Promise<transactionHash>;
  burn(owner: string): Promise<transactionHash>;
  has(owner: string): Promise<boolean>;
  getName(): Promise<string>;
  getSymbol(): Promise<string>;
  getTokenUri(owner: string): Promise<string>;
  getTokenTimestamp(owner: string): Promise<string | number>;
  getInfo(): Promise<AdapterInfo>;
  getNetwork(): Promise<unknown>;
}

let networks: Record<string, BlockchainAdapter>;

export function getBlockchainAdapter(networkName?: string) {
  if (!networkName) {
    throw new ClientError(`Please provide a X-BLOCKCHAIN header to specify the blockchain you'd like to connect to`);
  }

  if (networkName in networks) {
    return networks[networkName];
  } else {
    throw new ClientError(
      `Invalid network ${networkName}. Please choose one among ${Object.keys(networks).join(", ")}`
    );
  }
}

export default networks = {};

export async function initBlockchainAdapter() {
  const binanceWallet = createOwnerWallet(getEnvVar(ENVVARS.RPC_PROVIDER));
  networks["BINANCE"] = new EthereumAdapter({
    contract: getSoulboundTokenContract(getEnvVar(ENVVARS.SBT_CONTRACT), binanceWallet),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    provider: binanceWallet.provider!
  });

  const ethereumWallet = createOwnerWallet(getEnvVar(ENVVARS.ETHEREUM_RPC_URL));
  networks["ETHEREUM"] = new EthereumAdapter({
    contract: getSoulboundTokenContract(getEnvVar(ENVVARS.ETHEREUM_SBT_CONTRACT), ethereumWallet),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    provider: ethereumWallet.provider!
  });

  const tzSoulboundTokenInstance = await tezos.contract.at(getEnvVar("TEZOS_SBT_CONTRACT_ADDRESS"));

  networks["TEZOS"] = new TezosAdapter({
    contract: tzSoulboundTokenInstance
  });
}

export function getAvailableNetworks() {
  return Object.keys(networks).sort((a, b) => (a < b ? -1 : 1));
}
