# SoulboundToken Tezos

This is a Smart Contract for storing Verifiable Credentials on the Tezos Blockchain.

We will build a simple SBT contract that:

1. Auto increments token_id
1. Stores only one type of SBT per smart contract
1. Tokens aren't transferable
1. The token creation time is recorded so we can check if it has expired according the the verifier's criteria

## Setup

First, setup a `.env` file at the root of this project (parent dir to this README) with this content:

```.env
TEZOS_RPC_URL=http://127.0.0.1:20000
# This private key and addresses are the first account stored in flextesa, adjust to your needs
TEZOS_WALLET_PRIVATE_KEY=edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq
TEZOS_WALLET_ADDRESS=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
TEZOS_SBT_CONTRACT_ADDRESS=
```

## Build

To create the build directory with the latest SBT smart contract and the `json` michelson:

```
./run compile-contract
```

Check that you have a `./sbt-contract-tz/build/soulboundToken.json` file

## Sandbox

A flextesa sandbox is available here:

```
./run start-sandbox
```

## Test/debug

To test the smart contract, when running the local sandbox:

```
npm run test
```

You can also test in a node.js debugger by running

```
npm run test-debug
```

## Deploy

To deploy the built contract to a local node:

```
npm run deploy
```

This will execute the `deploy/deploy.js` script which for now is set to a DEFI type of token

Note the resulting address and set it into `TEZOS_SBT_CONTRACT_ADDRESS` in the `.env` file

## FA2

We are using an FA2 Smart Contract following those documentations:

FA2 Smart Contracts have multiple implementations. We've referred to the following documentation to design ours:

1. [Implementing FA2](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/implementing-fa2.md)
2. [TZIP12 proposal](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md)
3. [Wine collection training](https://github.com/marigold-dev/training-nft-1)

On top of this, we've made a few changes:

1. the transfer method always fails since transfers aren't allowed
2. a `ledger` big_map is maintained for compatibility with tzKT's indexer
3. `update_operator` is a noop
4. 3 utility views have been added to get the token's ipfs uri, the creation date or verify if an address owns a token.

