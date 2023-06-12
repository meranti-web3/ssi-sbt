require("dotenv").config({
  path: "../.env"
});

const { TezosToolkit, MichelsonMap } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { char2Bytes } = require("@taquito/utils");
const { Tzip12Module } = require("@taquito/tzip12");

const { BigNumber } = require("bignumber.js");
const { originateFA2Contract } = require("./utils.js");
const souldboundTokenContract = require("../build/soulboundToken.json");

describe("Given SoulboundToken is deployed", () => {
  let soulboundTokenInstance;
  let tezos;

  beforeAll(async () => {
    tezos = new TezosToolkit(process.env.TZ_RPC_URL);
    tezos.addExtension(new Tzip12Module());

    tezos.setProvider({
      signer: new InMemorySigner("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq")
    });
  });

  describe("When a new token is minted", () => {
    beforeAll(async () => {
      soulboundTokenInstance = await originateFA2Contract(tezos, souldboundTokenContract, {
        administrators: [],
        ledger: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        token_ids: []
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint(char2Bytes("DeFi"), char2Bytes("Proof of DeFi Compliance"), char2Bytes("DEFI"), char2Bytes("ifps://uri1"))
        .send();

      await mintOp.confirmation();
    });

    it("Then returns its metadata", async () => {
      expect(await soulboundTokenInstance.tzip12().getTokenMetadata(0)).toEqual({
        token_id: 0,
        uri: "ifps://uri1",
        decimals: 0,
        description: "Proof of DeFi Compliance",
        interfaces: '["TZIP-12"]',
        name: "DeFi",
        symbol: "DEFI"
      });
    });

    describe("When minting a 2nd token", () => {
      beforeAll(async () => {
        const mintOp = await soulboundTokenInstance.methods
          .mint(
            char2Bytes("DeFi"),
            char2Bytes("Proof of DeFi Compliance"),
            char2Bytes("DEFI"),
            char2Bytes("ifps://uri2")
          )
          .send();

        await mintOp.confirmation();
      });

      it("Then returns its metadata", async () => {
        expect(await soulboundTokenInstance.tzip12().getTokenMetadata(1)).toEqual({
          token_id: 1,
          uri: "ifps://uri2",
          decimals: 0,
          description: "Proof of DeFi Compliance",
          interfaces: '["TZIP-12"]',
          name: "DeFi",
          symbol: "DEFI"
        });
      });
    });
  });
});
