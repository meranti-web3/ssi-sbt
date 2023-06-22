import { Request } from "express";
import { soulboundTokens } from "../lib/soulboundTokens";
import EthereumAdapter from "./ethereum";
import { ClientError } from "../lib/errors";

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

const networks: Record<string, BlockchainAdapter> = {
  BINANCE: new EthereumAdapter({
    contract: soulboundTokens
  })
};

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

export default networks;
