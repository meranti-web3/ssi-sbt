import { ContractAbstraction, ContractProvider, MichelsonMap } from "@taquito/taquito";
import { BlockchainAdapter } from "../lib/adapters";
import { tezos } from "./network";

interface SoulboundTokenStorage {
  owner: string;
  admins: string[];
  tokens: MichelsonMap<string, string>;
  creation_dates: MichelsonMap<string, string>;
  name: string;
  symbol: string;
}

export default class TezosAdapter implements BlockchainAdapter {
  contract;

  constructor({ contract }: { contract: ContractAbstraction<ContractProvider> }) {
    this.contract = contract;
  }

  getContractAddress() {
    return Promise.resolve(this.contract.address);
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

    return mintOp.hash;
  }

  async burn(owner: string) {
    const mintOp = await this.contract.methods.burn(owner).send();

    return mintOp.hash;
  }

  has(owner: string) {
    return this.contract.contractViews.has_token(owner).executeView({
      viewCaller: this.contract.address
    });
  }

  async getName() {
    const storage = (await this.contract.storage()) as SoulboundTokenStorage;

    return storage.name;
  }

  async getSymbol() {
    const storage = (await this.contract.storage()) as SoulboundTokenStorage;

    return storage.symbol;
  }

  getTokenUri(owner: string) {
    return this.contract.contractViews.has_token(owner).executeView({
      viewCaller: this.contract.address
    });
  }

  getTokenTimestamp(owner: string) {
    return this.contract.contractViews.token_creation_date(owner).executeView({
      viewCaller: this.contract.address
    });
  }

  async getInfo() {
    return {
      network: await this.getNetwork(),
      contract_address: await this.getContractAddress(),
      symbol: await this.getSymbol(),
      name: await this.getName()
    };
  }

  async getNetwork() {
    return {
      name: "tezos",
      chainId: await tezos.rpc.getChainId()
    };
  }
}
