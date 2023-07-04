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
          data: char2Bytes(
            JSON.stringify({
              name: "DEFI",
              description:
                "This NFT is a proof of your KYC-AML compliance. It is not transferable. You can use it when you need to prove your comliance with DeFi services that have adopted decentralized identity to protect user data.",
              version: "1.0",
              license: "MIT",
              authors: ["Olivier Scherrer", "Meranti", "contact@meranti.fr"],
              homepage: "https://meranti.fr",
              source:
                "https://github.com/meranti-web3/ssi-sbt/blob/main/sbt-contract-tz/contracts/SoulboundToken.jsligo",
              interfaces: ["TZIP-012"],
              views: []
            })
          )
        }),
        name: "Proof of DeFi Compliance",
        symbol: "DEFI"
      });

      const mintOp = await soulboundTokenInstance.methods
        .mint("tz1iGCuoqC9LRTXJq5Gjni5KhY77bPG8M5XH", "ipfs://QmNtYrQYsTF5x9nQ3R34A7ES9kfbjtPVt3qcZ1E2425MxD")
        .send();

      await mintOp.confirmation();
    });

    it("Then returns the relevant contract metadata", async () => {
      expect(await soulboundTokenInstance.tzip12().getTokenMetadata(0)).toEqual({
        token_id: 0,
        decimals: 0,
        name: "DeFi compliance proof",
        symbol: "DEFI",
        description:
          "This NFT is a proof of your KYC-AML compliance. It is not transferable. You can use it when you need to prove your comliance with DeFi services that have adopted decentralized identity to protect user data.",
        image: "ipfs://QmUDYRnEsCv4vRmSY57PC6wZyc6xqGfZecdSaZmo2wnzDF",
        identifier: ""
      });
    });

    it("Then returns the relevant token metadata", async () => {
      const { metadata } = await soulboundTokenInstance.tzip16().getMetadata();

      expect(metadata).toEqual({
        name: "DEFI",
        description:
          "This NFT is a proof of your KYC-AML compliance. It is not transferable. You can use it when you need to prove your comliance with DeFi services that have adopted decentralized identity to protect user data.",
        version: "1.0",
        license: "MIT",
        authors: ["Olivier Scherrer", "Meranti", "contact@meranti.fr"],
        homepage: "https://meranti.fr",
        source: "https://github.com/meranti-web3/ssi-sbt/blob/main/sbt-contract-tz/contracts/SoulboundToken.jsligo",
        interfaces: ["TZIP-012"],
        views: []
      });
    });
  });
});
