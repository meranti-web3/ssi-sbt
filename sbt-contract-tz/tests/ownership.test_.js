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
  let tezos = new TezosToolkit(process.env.TZ_RPC_URL);
  tezos.addExtension(new Tzip12Module());

  describe("When a non admin user attempts to add themselves as an administrator", () => {
    let soulboundTokenInstance;

    beforeAll(async () => {
      tezos.setProvider({
        signer: new InMemorySigner("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq")
      });

      soulboundTokenInstance = await originateFA2Contract(tezos, souldboundTokenContract, {
        administrator: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        ledger: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        current_token_id: new BigNumber(0)
      });
    });

    it("Should fail with an error", async () => {
      try {
        await soulboundTokenInstance.methods.update_administrator("tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb").send();

        fail("transfer_administrator should throw an error since user is not admin");
      } catch (err) {
        expect(err.message).toEqual("FA2_NOT_OWNER");
      }
    });
  });

  // fixme: administrator is not updated!
  // describe("When an admin user transfers to another administrator", () => {
  //   let soulboundTokenInstance;

  //   beforeAll(async () => {
  //     tezos.setProvider({
  //       signer: new InMemorySigner("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq")
  //     });

  //     soulboundTokenInstance = await originateFA2Contract(tezos, souldboundTokenContract, {
  //       administrator: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
  //       ledger: MichelsonMap.fromLiteral({}),
  //       metadata: MichelsonMap.fromLiteral({}),
  //       token_metadata: MichelsonMap.fromLiteral({}),
  //       operators: MichelsonMap.fromLiteral({}),
  //       current_token_id: new BigNumber(0)
  //     });

  //     await soulboundTokenInstance.methods.update_administrator("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6").send();
  //   });

  //   it("Then transfers ownership", async () => {
  //     const storage = await soulboundTokenInstance.storage();

  //     expect(storage.administrator).toEqual("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6");
  //   });
  // });

  describe("When a non admin user attemps to mint", () => {
    let soulboundTokenInstance;

    beforeAll(async () => {
      tezos.setProvider({
        signer: new InMemorySigner("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq")
      });

      soulboundTokenInstance = await originateFA2Contract(tezos, souldboundTokenContract, {
        administrator: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        ledger: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        current_token_id: new BigNumber(0)
      });
    });

    it("Should fail with an error", async () => {
      try {
        await soulboundTokenInstance.methods
          .mint("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6", char2Bytes("ifps://uri1"))
          .send({
            fee: 1000
          });

        fail("mint should throw an error since no administrator is set");
      } catch (err) {
        expect(err.message).toEqual("FA2_NOT_OWNER");
      }
    });
  });
});
