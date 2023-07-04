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
        token_counter: 0,
        admins: ["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"],
        tokens: MichelsonMap.fromLiteral({}),
        tokens_by_owner: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({}),
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

    /**
     * I use this test to ensure our assets are visible in the FA2 compatible wallets
     * turned out that temple was looking at the michelson entrypoints to determine the contract type
     * and since I wasn't using layout:comb in the .jsligo, the order of the parameters was reverse
     * and thus not following the specs. I keep this test it's useful
     */
    it("Then offers an FA2 compatible API", async () => {
      const { entrypoints } = await tezos.rpc.getEntrypoints(soulboundTokenInstance.address);

      expect(
        isEntrypointsMatched(entrypoints, [
          ["balance_of", "pair", "list", "contract"],
          ["transfer", "list", "pair"],
          ["update_operators", "list", "or"]
        ])
      ).toEqual(true);
    });
  });
});

function isEntrypointsMatched(entrypoints, schema) {
  try {
    for (const [name, prim, ...args] of schema) {
      const entry = entrypoints[name];
      if (
        !entry ||
        entry.prim !== prim ||
        entry.args.length !== args.length ||
        args.some((arg, i) => {
          return arg !== entry.args[i]?.prim;
        })
      ) {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
}
