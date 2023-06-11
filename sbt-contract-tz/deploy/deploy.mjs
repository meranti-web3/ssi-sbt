import * as dotenv from "dotenv";
dotenv.config({
  path: "../.env"
});

import { TezosToolkit } from "@taquito/taquito";

const tezos = new TezosToolkit(process.env.TZ_RPC_URL);
