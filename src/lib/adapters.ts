import { Request } from "express";
import { soulboundTokens } from "../ethereum/soulboundTokens";
import EthereumAdapter from "../ethereum/ethereum";
import { ClientError } from "./errors";
import TezosAdapter from "../tezos/tezos";
import { tezos } from "../tezos/network";
import { getEnvVar } from "./envVars";

export type transactionHash = string;

interface AdapterInfo {
  network: unknown;
  contract_address: string;
  name: string;
  symbol: string;
}

export interface BlockchainAdapter {
  getContractAddress(): string;
  getBalanceOf(owner: string): Promise<number>;
  mint(owner: string, ipfs_url: string): Promise<transactionHash>;
  burn(owner: string): Promise<transactionHash>;
  has(owner: string): Promise<boolean>;
  getName(): Promise<string>;
  getSymbol(): Promise<string>;
  getTokenUri(owner: string): Promise<string>;
  getTokenTimestamp(owner: string): Promise<string>;
  getInfo(): Promise<AdapterInfo>;
  getNetwork(): Promise<unknown>;
}

let networks: Record<string, BlockchainAdapter>;

export function getBlockchainAdapter(req: Request) {
  const networkName = req.get("X-BLOCKCHAIN");

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
  networks["BINANCE"] = new EthereumAdapter({
    contract: soulboundTokens
  });

  const tzSoulboundTokenInstance = await tezos.contract.at(getEnvVar("TEZOS_SBT_CONTRACT_ADDRESS"));

  networks["TEZOS"] = new TezosAdapter({
    contract: tzSoulboundTokenInstance
  });
}
