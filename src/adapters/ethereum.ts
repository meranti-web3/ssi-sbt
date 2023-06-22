import { ethers } from "ethers";
import { BlockchainAdapter, transactionHash } from "./adapters";
import { soulboundTokens } from "../lib/soulboundTokens";
import { ClientError } from "../lib/errors";
import { provider } from "../lib/network";

function ensureValidAddress(address: string) {
  if (!ethers.utils.isAddress(address)) {
    throw new ClientError(`address "${address}" is invalid`);
  }
}

export default class EthereumAdapter implements BlockchainAdapter {
  contract!: ethers.Contract;

  constructor({ contract }: { contract: ethers.Contract }) {
    this.contract = contract;
  }

  getContractAddress() {
    return this.contract.address;
  }

  async getBalanceOf(owner: string) {
    ensureValidAddress(owner);

    return Number(await this.contract.balanceOf(owner));
  }

  async mint(owner: string, ipfs_url: string): Promise<transactionHash> {
    ensureValidAddress(owner);

    const tx = await this.contract.mint(owner, ipfs_url);

    return tx.hash;
  }

  async burn(owner: string): Promise<transactionHash> {
    ensureValidAddress(owner);

    const tokenId = await this.contract.tokenOfOwnerByIndex(owner, 0);
    const tx = await soulboundTokens.burn(tokenId);

    return tx.hash;
  }

  async has(owner: string) {
    ensureValidAddress(owner);

    const tokenCount = Number(await this.contract.balanceOf(owner));

    return tokenCount > 0;
  }

  getName() {
    return this.contract.name();
  }

  getSymbol() {
    return this.contract.symbol();
  }

  async getTokenUri(owner: string) {
    ensureValidAddress(owner);

    const token_id = await this.getTokenIdByOwner(owner);
    return this.contract.tokenURI(token_id);
  }

  async getTokenTimestamp(owner: string) {
    ensureValidAddress(owner);

    const token_id = await this.getTokenIdByOwner(owner);
    return this.contract.tokenTimestamp(token_id);
  }

  async getInfo() {
    return {
      network: provider.network,
      contract_address: this.getContractAddress(),
      name: await this.getName(),
      symbol: await this.getSymbol()
    };
  }

  async getNetwork() {
    return provider.network;
  }

  private getTokenIdByOwner(owner: string): Promise<number> {
    return this.contract.tokenOfOwnerByIndex(owner, 0);
  }
}
