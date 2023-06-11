# Install

To run this app locally or remotely:

## Local development

After cloning the repository:

```
npm install
```

To run the dev environment:

First, setup a `.env` file:

```
RPC_PROVIDER=<bsc node you want to connect to>
WALLET_PRIVATE_KEY=
WALLET_ADDRESS=
SBT_CONTRACT=<see ./sbt-contract-evm for deployment>
API_KEY=testKey # the postman collection expects testKey by default
```

If you don't have an SBT contract handy, you can deploy a new one to your preferred network by following the `./sbt-contract-evm/README.md`

```
npm run dev
```

You can then exercise this API using the [postman collection](./postman/test-collection.json) or looking at the sample curl commands in the [README](./README.md).

## Deploy

This repository is automatically deployed when new changes are pushed to the `main` branch.

If you need to deploy this yourself, simply `npm run build` then `npm run start`. This will run the `./dist/index.js` file on your node.js server. The main file is just an `express` server.