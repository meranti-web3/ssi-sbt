import * as dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import type { AddressInfo } from "net";

import { soulboundTokens } from "./lib/soulboundTokens";
import { provider } from "./lib/network";
import { asyncErrorHandling, ClientError, errorMiddleware } from "./lib/errors";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post<{
  transfer_to: string;
  ipfs_url: string;
}>(
  "/mint",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const { transfer_to, ipfs_url } = req.body;

    if (!ethers.utils.isAddress(transfer_to)) {
      throw new ClientError(`address "${transfer_to}" is invalid`);
    }

    const tokenCount = Number(await soulboundTokens.balanceOf(transfer_to));

    let tx;

    if (tokenCount > 0) {
      throw new ClientError(`address ${transfer_to} already has this token`);
    } else {
      tx = await soulboundTokens.mint(transfer_to, ipfs_url);
    }

    res.status(200).send({
      network: provider.network,
      contract_address: soulboundTokens.address,
      tx_hash: tx.hash
    });
  })
);

app.post<{ address_for: string }>(
  "/burn",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const { address_for } = req.body;

    if (!ethers.utils.isAddress(address_for)) {
      throw new ClientError(`address "${address_for}" is invalid`);
    }

    let tokenCount = Number(await soulboundTokens.balanceOf(address_for));

    let tx;

    if (tokenCount === 0) {
      throw new ClientError(`address ${address_for} doesn't have this token`);
    } else {
      const tokenId = await soulboundTokens.tokenOfOwnerByIndex(address_for, 0);
      tx = await soulboundTokens.burn(tokenId);
    }

    res.status(200).send({
      network: provider.network,
      contract_address: soulboundTokens.address,
      tx_hash: tx.hash
    });
  })
);

app.get<{
  address_for: string;
}>(
  "/has/:address_for",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const { address_for } = req.params;

    if (!ethers.utils.isAddress(address_for)) {
      throw new ClientError(`address "${address_for}" is invalid`);
    }

    const tokenCount = Number(await soulboundTokens.balanceOf(address_for));

    res.status(200).send({
      network: provider.network,
      contract_address: soulboundTokens.address,
      has_token: tokenCount > 0
    });
  })
);

app.get(
  "/info",
  asyncErrorHandling(async function (req: Request, res: Response) {
    res.send({
      network: provider.network,
      contract_address: soulboundTokens.address,
      name: await soulboundTokens.name(),
      symbol: await soulboundTokens.symbol()
    });
  })
);

app.get<{
  token_id: string;
}>(
  "/id/:token_id",
  asyncErrorHandling(async function (req: Request, res: Response) {
    const token_id = Number(req.params.token_id);

    let token_uri, token_creation_timestamp;

    try {
      token_uri = await soulboundTokens.tokenURI(token_id);
      token_creation_timestamp = await soulboundTokens.tokenTimestamp(token_id);
    } catch (err) {
      throw new ClientError(`token_id ${token_id} doesn't exist`);
    }

    res.status(200).send({
      network: provider.network,
      contract_address: soulboundTokens.address,
      token_uri,
      token_creation_timestamp: Number(token_creation_timestamp)
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

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
