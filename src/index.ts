import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${server.address()?.port}`);
});
