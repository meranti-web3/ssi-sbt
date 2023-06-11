require("dotenv").config({
  path: "../.env"
});

const { TezosToolkit, MichelsonMap } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { char2Bytes } = require("@taquito/utils");
const { Tzip12Module, tzip12 } = require("@taquito/tzip12");

const { BigNumber } = require("bignumber.js");
const { originateFA2Contract } = require("./utils.js");
const souldboundTokenContract = require("../build/soulboundToken.json");

describe("Given SoulboundToken is deployed", () => {
  let soulboundTokenInstance;
  let tezos;
  let storage;

  beforeAll(async () => {
    tezos = new TezosToolkit(process.env.TZ_RPC_URL);
    tezos.addExtension(new Tzip12Module());

    tezos.setProvider({
      signer: new InMemorySigner("edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq")
    });

    soulboundTokenInstance = await originateFA2Contract(tezos, souldboundTokenContract, {
      administrators: [],
      ledger: MichelsonMap.fromLiteral({}),
      metadata: MichelsonMap.fromLiteral({}),
      token_metadata: MichelsonMap.fromLiteral({}),
      operators: MichelsonMap.fromLiteral({}),
      token_ids: []
    });

    const mintOp = await soulboundTokenInstance.methods
      .mint(
        new BigNumber(0),
        char2Bytes("DeFi"),
        char2Bytes("Proof of DeFi Compliance"),
        char2Bytes("DEFI"),
        char2Bytes("ifps://uri1")
      )
      .send();

    await mintOp.confirmation();

    storage = await soulboundTokenInstance.storage();
  });

  it("Then returns the default value", async () => {
    console.log(await storage.token_metadata.get(0));
    console.log(await soulboundTokenInstance.tzip12().getTokenMetadata(0));
  });
});
