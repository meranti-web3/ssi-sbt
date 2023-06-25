import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { Tzip12Module } from "@taquito/tzip12";

import { getEnvVar } from "../lib/envVars";

export const tezos = new TezosToolkit(getEnvVar("TEZOS_RPC_URL"));
tezos.addExtension(new Tzip12Module());

tezos.setProvider({
  signer: new InMemorySigner(getEnvVar("TEZOS_WALLET_PRIVATE_KEY"))
});
