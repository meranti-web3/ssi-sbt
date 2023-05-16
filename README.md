# SSI SBT

Self Sovereign Identity based Soulbound Tokens (SBTs).

SBTs are on-chain tokens holding personal information that can't be transfered (soulbound).
This can be useful for a Smart Contract (ERC721) to verify a user's credentials such as proof of age or identity.

This API is meant to be used by Issuers of Verifiable Credentials to generate the related SBTs.

## Contract addresses

/!\ Those addresses may change, contracts are not updatable

| blockchain  | address                                      |
| ----------- | -------------------------------------------- |
| sepolia     | `0x240863E65b2ace78eda93334be396FF220f14354` |
| eth mainnet | not yet                                      |

## Install

After cloning the repository:

```
npm install
```

To run the dev environment

First, setup a `.env` file:

```
SEPOLIA_RPC_URL=
ETH_RPC_URL=
WALLET_PK=
SBT_CONTRACT=
API_TOKEN=
```

If you don't have an SBT contract handy, you can deploy a new one to your preferred network by following the `./sbt-contract/README.md`

```
npm run dev
```

## Deploy

This repository is automatically deployed when new changes are pushed to the `main` branch.

If you need to deploy this yourself, simply `npm run build` then `npm run start` the `./dist/index.js` file on your node.js server. The main file is just an `express` server.

## API

Please use the Postman Collection to exercise this API.

Example request:

```curl
curl --location --request POST 'https://api-url.com/mint' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'transfer_to=0x123address' \
--data-urlencode 'ipfs_url=ipfs://ipfs-url'
```
