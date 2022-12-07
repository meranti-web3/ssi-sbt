import express from "express";
import type { AddressInfo } from "net";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
