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

## Test

Before starting you need to add those variables in a `.env`

```sh
RPC_URL=http://127.0.0.1:8545
ETHEREUM_RPC_URL=http://127.0.0.1:8545/
POLYGONPOS_RPC_URL=http://127.0.0.1:8545/
```

1. First of all you need to run a Tezos and Ethereum node with docker, to do that you can run at the root:

```sh
docker compose up --detach
```
(Now you have the two blockchains running).

2. Then you have to deploy your tezos and Ethereum contracts, you can simply run the shell script ./deploy.sh:

```sh
source ./deploy.sh
```

You finally need to run npm start in the same terminal you used for the shell command `source ./deploy.sh`


The node server needs to be on `port 3000`

And finally to test the API run this command at the root, where the file test named `api.test.js` is located :

```sh
npm run test
```