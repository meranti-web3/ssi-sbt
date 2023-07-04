require("dotenv").config({
  path: "../.env"
});

const { MichelsonMap, TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { Tzip12Module } = require("@taquito/tzip12");
const { char2Bytes } = require("@taquito/utils");

const { originateSBTContract } = require("../tests/utils");
const souldboundTokenContract = require("../build/soulboundToken.json");

const tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);
tezos.addExtension(new Tzip12Module());

tezos.setProvider({
  signer: new InMemorySigner(process.env.TEZOS_WALLET_PRIVATE_KEY)
});

async function deploy() {
  const contract = await originateSBTContract(tezos, souldboundTokenContract, {
    token_counter: 0,
    admins: [process.env.TEZOS_WALLET_ADDRESS],
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

  console.log(`SoulboundToken Contract deployed at ${contract.address}`);
}


deploy();