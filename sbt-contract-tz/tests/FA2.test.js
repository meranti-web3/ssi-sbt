require("dotenv").config({
  path: "../.env"
});

const { TezosToolkit, MichelsonMap } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { Tzip12Module } = require("@taquito/tzip12");

const { originateSBTContract } = require("./utils.js");
const souldboundTokenContract = require("../build/soulboundToken.json");

describe("Given SoulboundToken is deployed", () => {
  let soulboundTokenInstance;
  let tezos;

  beforeAll(async () => {
    tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);
    tezos.addExtension(new Tzip12Module());

    tezos.setProvider({
      signer: new InMemorySigner(process.env.TEZOS_WALLET_PRIVATE_KEY)
    });
  });

  describe("When a new token is minted", () => {
    beforeAll(async () => {
      soulboundTokenInstance = await originateSBTContract(tezos, souldboundTokenContract, {
        admins: ["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"],
        tokens: MichelsonMap.fromLiteral({}),
        creation_dates: MichelsonMap.fromLiteral({}),
        name: "Proof of DeFi Compliance",
        symbol: "DEFI"
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6", "ipfs://uri1")
        .send();

      await mintOp.confirmation();
    });

    it("Then offers an FA2 compatible transfer method that doesn't allow transfer", async () => {
      try {
        await soulboundTokenInstance.methods
          .transfer([
            {
              from_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
              tx: [
                {
                  to_: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                  token_id: 0
                }
              ]
            }
          ])
          .send();
      } catch (err) {
        expect(err.message).toEqual("FA2_TX_DENIED");
      }
    });

    it("Then offers an FA2 compatible balance_of method", async () => {
      await soulboundTokenInstance.methods.balance_of({
        requests: [{
          owner: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
          token_id: 0
        }
        ]
      })
    });
  });
});
