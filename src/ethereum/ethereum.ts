import { ethers } from "ethers";
import { BlockchainAdapter, transactionHash } from "../lib/adapters";
import { ClientError } from "../lib/errors";

function ensureValidAddress(address: string) {
  if (!ethers.isAddress(address)) {
    throw new ClientError(`address "${address}" is invalid`);
  }
}

export default class EthereumAdapter implements BlockchainAdapter {
  contract!: ethers.Contract;
  provider!: ethers.Provider;

  constructor({ contract, provider }: { contract: ethers.Contract; provider: ethers.Provider }) {
    this.contract = contract;
    this.provider = provider;
  }

  async getContractAddress() {
    return this.contract.getAddress();
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

    const estimatedGas = await this.contract.burn.estimateGas(tokenId);

    const tx = await this.contract.burn(tokenId, {
      gasLimit: estimatedGas + estimatedGas / 10n
    });

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
    return Number(await this.contract.tokenTimestamp(token_id));
  }

  async getInfo() {
    return {
      network: await this.provider.getNetwork(),
      contract_address: await this.getContractAddress(),
      name: await this.getName(),
      symbol: await this.getSymbol()
    };
  }

  async getNetwork() {
    return this.provider.getNetwork();
  }

  private getTokenIdByOwner(owner: string): Promise<number> {
    return this.contract.tokenOfOwnerByIndex(owner, 0);
  }
}
