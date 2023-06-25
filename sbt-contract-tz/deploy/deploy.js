require("dotenv").config({
  path: "../.env"
});

const { MichelsonMap, TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { Tzip12Module } = require("@taquito/tzip12");

const { originateSBTContract } = require("../tests/utils");
const souldboundTokenContract = require("../build/soulboundToken.json");

const tezos = new TezosToolkit(process.env.TEZOS_RPC_URL);
tezos.addExtension(new Tzip12Module());

tezos.setProvider({
  signer: new InMemorySigner(process.env.TEZOS_WALLET_PRIVATE_KEY)
});

async function deploy() {
  const contract = await originateSBTContract(tezos, souldboundTokenContract, {
    admins: [process.env.TEZOS_WALLET_ADDRESS],
    tokens: MichelsonMap.fromLiteral({}),
    name: "Proof of DeFi compliance",
    symbol: "DEFI"
  });

  console.log(`SoulboundToken Contract deployed at ${contract.address}`);
}


deploy();