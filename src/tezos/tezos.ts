import { ContractAbstraction, ContractProvider, MichelsonMap } from "@taquito/taquito";
import { char2Bytes, bytes2Char } from "@taquito/utils";
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
    const mintOp = await this.contract.methods.mint(owner, char2Bytes(ipfs_url)).send();

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

  async getTokenUri(owner: string) {
    const tokenUri = await this.contract.contractViews.token_uri(owner).executeView({
      viewCaller: this.contract.address
    });

    return bytes2Char(tokenUri);
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
