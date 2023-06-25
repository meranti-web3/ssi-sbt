import { BlockchainAdapter } from "../lib/adapters";

export default class TezosAdapter implements BlockchainAdapter {
  contract;

  constructor({ contract }: { contract: any }) {
    this.contract = contract;
  }

  getContractAddress() {
    return this.contract.address;
  }

  async getBalanceOf(owner: string) {
    return (await this.contract.contractViews.has_token(owner).executeView({
      viewCaller: this.contract.address
    }))
      ? 1
      : 0;
  }

  async mint(owner: string, ipfs_url: string) {
    const mintOp = await this.contract.methods.mint(owner, ipfs_url).send();

    await mintOp.confirmation();

    return mintOp.hash;
  }

  async burn(owner: string) {
    const mintOp = await this.contract.methods.burn(owner).send();

    await mintOp.confirmation();

    return mintOp.hash;
  }

  has(owner: string) {
    return this.contract.contractViews.has_token(owner).executeView({
      viewCaller: this.contract.address
    });
  }

  async getName() {
    const storage = await this.contract.storage();

    return storage.name;
  }

  async getSymbol() {
    const storage = await this.contract.storage();

    return storage.symbol;
  }

  getTokenUri(owner: string): Promise<string> {
    return this.contract.contractViews.has_token(owner).executeView({
      viewCaller: this.contract.address
    });
  }

  getTokenTimestamp(owner: string): Promise<any> {
    return Promise.resolve(0);
  }

  async getInfo() {
    return {
      network: await this.getNetwork(),
      contract_address: this.getContractAddress(),
      symbol: await this.getSymbol(),
      name: await this.getName()
    };
  }

  async getNetwork() {
    return {
      name: this.contract.rpc.chain,
      chainId: await this.contract.rpc.getChainId()
    };
  }
}