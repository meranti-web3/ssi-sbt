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
        name: "Proof of DeFi Compliance",
        symbol: "DEFI"
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6", "ipfs://uri1")
        .send();

      await mintOp.confirmation();
    });

    it("Then returns its storage", async () => {
      const storage = await soulboundTokenInstance.storage();
      expect(await storage.admins).toEqual(["tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"]);
      expect(await storage.name).toEqual("Proof of DeFi Compliance");
      expect(await storage.symbol).toEqual("DEFI");
    });

    it("Then returns its token uri", async () => {
      expect(
        await soulboundTokenInstance.contractViews.token_uri("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6").executeView({
          viewCaller: soulboundTokenInstance.address
        })
      ).toEqual("ipfs://uri1");
    });

    it("Then returns its creation date", async () => {
      const actualDate = new Date(
        await soulboundTokenInstance.contractViews
          .token_creation_date("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6")
          .executeView({
            viewCaller: soulboundTokenInstance.address
          })
      );

      const expectedDate = new Date((await soulboundTokenInstance.rpc.getBlockHeader()).timestamp);

      expect(expectedDate).toEqual(actualDate);
    });

    it("Then tells if the owner has a token", async () => {
      expect(
        await soulboundTokenInstance.contractViews.has_token("tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6").executeView({
          viewCaller: soulboundTokenInstance.address
        })
      ).toEqual(true);
    });
  });
});
