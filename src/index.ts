import express from "express";
import bodyParser from "body-parser";
import type { AddressInfo } from "net";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post("/mint", function (req, res) {
  res.send(`Minting item with ${JSON.stringify(req.body)}`);
});

app.get("/", function (req, res) {
  res.send("you're probably lost here. If not, please contact olivier@meranti.fr");
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
