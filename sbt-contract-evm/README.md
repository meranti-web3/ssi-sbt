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

```
npx hardhat node
npx hardhat run --network sepolia scripts/deploy.ts
```

## Networks

To deploy to additional networks, please add the relevant RPC nodes urls in the `.env` at the root of this project:

```
SEPOLIA_RPC_URL=<sepolia rpc node url>
BSCTEST_RPC_URL=<binance test rpc node url>
BSCMAIN_RPC_URL=<binance main rpc node url>
```
