require("dotenv").config({
  path: "../.env"
});

const { TezosToolkit, MichelsonMap } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { Tzip12Module } = require("@taquito/tzip12");
const { Tzip16Module } = require("@taquito/tzip16");
const { char2Bytes } = require("@taquito/utils");

const { originateSBTContract } = require("./utils.js");
const souldboundTokenContract = require("../build/soulboundToken.json");

describe("Given SoulboundToken is deployed", () => {
  let soulboundTokenInstance;
  let tezos;

  beforeAll(async () => {
    tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);
    tezos.addExtension(new Tzip12Module());
    tezos.addExtension(new Tzip16Module());

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
        token_metadata: MichelsonMap.fromLiteral({}),
        metadata: MichelsonMap.fromLiteral({
          "": char2Bytes("tezos-storage:data"),
          "data": char2Bytes(JSON.stringify({
            name: "DEFI",
            symbol: "DEFI",
            thumbnailUri: "ipfs://QmUDYRnEsCv4vRmSY57PC6wZyc6xqGfZecdSaZmo2wnzDF",
            decimals: 0
          }))
        }),
        name: "Proof of DeFi Compliance",
        symbol: "DEFI"
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint("tz1iGCuoqC9LRTXJq5Gjni5KhY77bPG8M5XH", "ipfs://uri1")
        .send();

      await mintOp.confirmation();
    });

    it("Then returns the relevant metadata", async () => {
      console.log(await soulboundTokenInstance.storage());
      console.log(await soulboundTokenInstance.tzip12().getTokenMetadata(0));
      console.log(await soulboundTokenInstance.tzip16().getMetadata());
    });
  });
});
