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
        administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        ledger: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        current_token_id: new BigNumber(0)
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6", char2Bytes("ifps://uri1"))
        .send();

      await mintOp.confirmation();
    });

    it("Then doesn't allow its transfer", async () => {
      try {
        await soulboundTokenInstance.methods
          .transfer([
            {
              from_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
              txs: [
                {
                  to_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
                  token_id: 0,
                  amount: 0
                }
              ]
            }
          ])
          .send();
      } catch (err) {
        expect(err.message).toEqual("FA2_TX_DENIED");
      }
    });
  });
});
