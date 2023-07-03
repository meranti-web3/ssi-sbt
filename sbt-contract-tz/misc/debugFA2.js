/**
 * I used this file to debug some Template code to see how to ensure our assets are visible
 * turned out that temple was looking at the michelson entrypoints to determine the contract type
 * and since I wasn't using layout:comb in the .jsligo the order of the parameters was reverse
 * and thus not following the specs. I keep this code it's useful
 */
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

async function debug() {
  const { entrypoints } = await tezos.rpc.getEntrypoints("KT1NahBvogh6KVgu8JTKjAadvN2HJToHUQXp");

  console.log(
    isEntrypointsMatched(entrypoints, [
      ["balance_of", "pair", "list", "contract"],
      ["transfer", "list", "pair"],
      ["update_operators", "list", "or"]
    ])
  );
}

function isEntrypointsMatched(entrypoints, schema) {
  debugger;
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

debug();
