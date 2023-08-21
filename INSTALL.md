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

First of all you need to run a Tezos node with docker, in the folder `sbt-contract-tz` there is an executable called `run` to run the container you have to run this cmd line :

```sh
./run start-sandbox
```

then to compile the contract :

```sh
./run compile-contract
```

after this you have run the deployed contract with this command line :

```sh
npm run deploy
```
(the node version has to be 18 or above)

after you deployed the contract you will receive an adress in the terminal that you need to copy and paste in your `.env`

In case you don't know you run the node server with this command line :

```sh
npm start
```

The node server needs to be on port 3000

And finally to test the API run this command at the root, where the tests are :

```sh
npx jest token.test.js
```