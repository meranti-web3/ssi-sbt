import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import type { AddressInfo } from "net";

import { getAvailableNetworks, getBlockchainAdapter, initBlockchainAdapter } from "./lib/adapters";
import { asyncErrorHandling, ClientError, errorMiddleware } from "./lib/errors";
import { requireAuth } from "./lib/requireAuth";
import { ENVVARS, getEnvVar } from "./lib/envVars";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.all(["/mint", "/burn"], requireAuth(getEnvVar(ENVVARS.API_KEY)));

app.post<{
  transfer_to: string;
  ipfs_url: string;
}>(
  "/mint",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const blockchainNetwork = getBlockchainAdapter(req.get("X-BLOCKCHAIN"));
    const { transfer_to, ipfs_url } = req.body;

    const hasToken = await blockchainNetwork.has(transfer_to);

    let txHash;

    if (hasToken) {
      throw new ClientError(`address ${transfer_to} already has this token`);
    } else {
      txHash = await blockchainNetwork.mint(transfer_to, ipfs_url);
    }

    res.status(200).send({
      network: await blockchainNetwork.getNetwork(),
      contract_address: blockchainNetwork.getContractAddress(),
      tx_hash: txHash
    });
  })
);

app.post<{ address_for: string }>(
  "/burn",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const blockchainNetwork = getBlockchainAdapter(req.get("X-BLOCKCHAIN"));
    const { address_for } = req.body;

    const hasToken = await blockchainNetwork.has(address_for);

    let txHash;

    if (!hasToken) {
      throw new ClientError(`address ${address_for} doesn't have this token`);
    } else {
      txHash = await blockchainNetwork.burn(address_for);
    }

    res.status(200).send({
      network: await blockchainNetwork.getNetwork(),
      contract_address: blockchainNetwork.getContractAddress(),
      tx_hash: txHash
    });
  })
);

app.get<{
  address_for: string;
}>(
  "/has/:address_for",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const blockchainNetwork = getBlockchainAdapter(req.get("X-BLOCKCHAIN"));
    const { address_for } = req.params;

    const hasToken = await blockchainNetwork.has(address_for);

    res.status(200).send({
      network: await blockchainNetwork.getNetwork(),
      contract_address: blockchainNetwork.getContractAddress(),
      has_token: hasToken
    });
  })
);

app.get(
  "/info",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const selectedBlockchain = req.get("X-BLOCKCHAIN");

    res.send(
      await Promise.all(
        getAvailableNetworks().map(async (networkName) => {
          return {
            networkName,
            selected: networkName === selectedBlockchain,
            info: await getBlockchainAdapter(networkName).getInfo()
          };
        })
      )
    );
  })
);

app.get<{
  token_id: string;
}>(
  "/token/:address_for",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const blockchainNetwork = getBlockchainAdapter(req.get("X-BLOCKCHAIN"));

    const { address_for } = req.params;

    const hasToken = await blockchainNetwork.has(address_for);

    if (!hasToken) {
      throw new ClientError(`address ${address_for} doesn't have this token`);
    }

    const token_uri = await blockchainNetwork.getTokenUri(address_for);
    const token_creation_timestamp = await blockchainNetwork.getTokenTimestamp(address_for);

    res.status(200).send({
      network: await blockchainNetwork.getNetwork(),
      contract_address: blockchainNetwork.getContractAddress(),
      token_uri,
      token_creation_timestamp
    });
  })
);

app.get("/", function (req, res) {
  res.send(
    'Welcome! This API allows you to mint Soulbound Tokens to hold your Verifiable Credentials. See <a href="https://github.com/meranti-web3/ssi-sbt">https://github.com/meranti-web3/ssi-sbt</a> for more information'
  );
});

// Error handling, this block should be defined last.
app.use(errorMiddleware);

async function initServer() {
  await initBlockchainAdapter();

  const server = app.listen(process.env.PORT || 3000, function () {
    console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
  });
}

initServer();
