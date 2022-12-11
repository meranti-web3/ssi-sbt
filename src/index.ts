import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import type { AddressInfo } from "net";
import { soulboundTokens } from "./lib/soulboundTokens";

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
    res.status(400).send(`Client error, address ${transfer_to} already has this token.`);
  } else {
    tx = await soulboundTokens.mint(transfer_to, ipfs_url);
  }

  res.status(200).send({
    network: soulboundTokens.RPC_PROVIDER,
    contractAddress: soulboundTokens.address,
    txHash: tx.txHash
  });
});

app.post<{ address_for: string }>("/burn", async function (req, res) {
  const { address_for } = req.body;

  const hasToken = await soulboundTokens.balanceOf(address_for);

  let tx;

  if (hasToken === 0) {
    res.status(400).send(`Client error, address ${address_for} doesn't have this token.`);
  } else {
    tx = await soulboundTokens.burn(address_for);
  }

  res.status(200).send({
    network: soulboundTokens.RPC_PROVIDER,
    contractAddress: soulboundTokens.address,
    txHash: tx.txHash
  });
});

app.get<{
  address_for: string;
}>("/hasSbt/:address_for", async function (req, res) {
  const { address_for } = req.params;

  const balance = await soulboundTokens.balanceOf(address_for);

  res.status(200).send({
    network: soulboundTokens.RPC_PROVIDER,
    contractAddress: soulboundTokens.address,
    has_token: balance > 0
  });
});

app.get("/info", function (req, res) {
  res.send({
    network: soulboundTokens.RPC_PROVIDER,
    contractAddress: soulboundTokens.address
  });
});

app.get("/", function (req, res) {
  res.send("you're probably lost here. If not, please contact olivier@meranti.fr");
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
