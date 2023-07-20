# SoulboundTokens

A SoulboundTokens contract for storing uris to Verifiable Credentials stored in IPFS.
Each Contract should hold one type of Souldbound Tokens (i.e. proof of 18, proof of ID, etc).
This pattern will allow dApps to verify credentials on chain to allow users to access permissioned dApps without giving away personal information.

## Test

To run the tests, first start a hardhat node on your local machine:

```
npx hardhat node
```

Then run the tests

```
npx hardhat test

# if you want to see the gas price:
REPORT_GAS=true npx hardhat test
```

## Deploy

Specify the network RPC URL via RPC_URL while running the deploy command:

```
npx hardhat node
RPC_URL=<url here> npx hardhat run --network deployNetwork scripts/deploy.ts
```
