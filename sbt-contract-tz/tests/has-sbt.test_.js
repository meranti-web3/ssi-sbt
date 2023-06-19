require("dotenv").config({
  path: "../.env"
});

const { TezosToolkit, MichelsonMap } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { char2Bytes, bytes2Char } = require("@taquito/utils");
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

    it("Should ", async () => {
      // const views = await soulboundTokenInstance.tzip16().metadataViews();
      // console.log(await views.get_balance().executeView(["tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6", 0]));

      const response = await soulboundTokenInstance.views.balance_of([{
        owner: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        token_id: "0"
      }]).read();

      console.log(Number(response[0].balance))
    });
  });
});
