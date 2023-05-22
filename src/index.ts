import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import type { AddressInfo } from "net";
import { soulboundTokens } from "./lib/soulboundTokens";
import { provider } from "./lib/network";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post<{
  transfer_to: string;
  ipfs_url: string;
}>("/mint", async function (req, res) {
  const { transfer_to, ipfs_url } = req.body;

  const hasToken = await soulboundTokens.balanceOf(transfer_to);

  let tx;

  if (hasToken > 0) {
    res.status(430).send({
      error: `Client error, address ${transfer_to} already has this token.`
    });
    return;
  } else {
    tx = await soulboundTokens.mint(transfer_to, ipfs_url);
  }

  res.status(200).send({
    network: provider.network,
    contract_address: soulboundTokens.address,
    tx_hash: tx.hash
  });
});

app.post<{ address_for: string }>("/burn", async function (req, res) {
  const { address_for } = req.body;

  const hasToken = await soulboundTokens.balanceOf(address_for);

  let tx;

  if (hasToken === 0) {
    res.status(430).send({
      error: `Client error, address ${address_for} doesn't have this token.`
    });
    return;
  } else {
    const tokenId = await soulboundTokens.tokenOfOwnerByIndex(address_for, 0);
    tx = await soulboundTokens.burn(tokenId);
  }

  res.status(200).send({
    network: provider.network,
    contract_address: soulboundTokens.address,
    tx_hash: tx.hash
  });
});

app.get<{
  address_for: string;
}>("/has/:address_for", async function (req, res) {
  const { address_for } = req.params;

  const balance = await soulboundTokens.balanceOf(address_for);

  res.status(200).send({
    network: provider.network,
    contract_address: soulboundTokens.address,
    has_token: balance > 0
  });
});

app.get("/info", async function (req, res) {
  res.send({
    network: provider.network,
    contract_address: soulboundTokens.address,
    name: await soulboundTokens.name(),
    symbol: await soulboundTokens.symbol()
  });
});

app.get<{
  token_id: number;
}>("/id/:token_id", async function (req, res) {
  const { token_id } = req.params;

  const token_uri = await soulboundTokens.tokenURI(token_id);
  const token_creation_timestamp = await soulboundTokens.tokenTimestamp(token_id);

  res.status(200).send({
    network: provider.network,
    contract_address: soulboundTokens.address,
    token_uri,
    token_creation_timestamp: Number(token_creation_timestamp)
  });
});

app.get("/", function (req, res) {
  res.send(
    'Welcome! This API allows you to mint Soulbound Tokens to hold your Verifiable Credentials. See <a href="https://github.com/meranti-web3/ssi-sbt">https://github.com/meranti-web3/ssi-sbt</a> for more information'
  );
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
