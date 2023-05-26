# SSI SBT

Self Sovereign Identity based Soulbound Tokens (SBTs).

SBTs are on-chain tokens holding personal information that can't be transfered (soulbound).
They're implemented using ERC721 but restricting burns and tranfers.
This can be useful for on-chain dApps, in the gaming or DeFi worlds for instance, to permission access without going off-chain.

This app is meant to be used by Issuers of Verifiable Credentials to generate the related SBTs for users who need to get permissioned access to dApps.
The minted SBTs can be consumed by dApps that need to verify a user's credentials.

## Contract addresses

As a dApp (verifier), to verify if a user possesses a given token, you'll need to access the relevant Smart Contract.

### Altme DeFi Proof Of Compliance (DEFI)

This is the address for Altme's DeFi Proof Of Compliance (DEFI) token (https://issuer.talao.co/nft/defi)

| blockchain  | address                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| BSC Testnet | [`0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba`](https://testnet.bscscan.com/address/0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba) |
| BSC Mainnet | [`0x240863E65b2ace78eda93334be396FF220f14354`](https://bscscan.com/address/0x240863E65b2ace78eda93334be396FF220f14354)         |

/!\ Those addresses may change, contracts are not updatable

## Soulbound Token API

The solidity code for the Soulbound Token can be found in [`./sbt-contract`](./sbt-contract/contracts/SoulboundTokens.sol).

The contract ABI can be found in [`./sbt-contract/abi.json`](./sbt-contract/abi.json).

It's implementing the ERC721 interface from OpenZeppelin and will work like most ERC721.

The main differences are:

- transfers are blocked.
- we record the token's creation date so we can check if it has expired.

### Verify that a user does own a given token

```solidity
require(soulboundToken.balanceOf(address) > 0, "address doesn't have this token");
```

### Burn a token

A token owner can burn their own token via a Solidity call.

```solidity
soulboundToken.burn(token_id);
```

### Check expiry on-chain

As a verifier, you may check if a token is still valid by retrieving its timestamp:

```solidity
uint256 creation_date = soulboundToken.tokenTimestamp(token_id);

require(block.timestamp < (creation_date + 3600 * 24 * 60), "token has expired");
```

## Install

View the [Install](./INSTALL.md) guide if you want to run this service locally or deploy it to another environment.

## REST API

Only token issuers should need to use this API. Please check the [Postman Collection](./postman/test-collection.json) to exercise it. On-chain verifiers should use the Smart Contract's relevant methods.

Example request:

### Mint

Mint requires a `transfer_to` address and an `ipfs_url` url. Also make sure to set the `X-API-KEY` for authentication.

```curl
curl --location --request POST 'localhost:3000/mint' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'X-API-KEY: testKey' \
--data-urlencode 'transfer_to=0x123address' \
--data-urlencode 'ipfs_url=ipfs://ipfs-url'
```

Response:

```
{
    "network": {
        "name": "bnbt",
        "chainId": 97,
        "ensAddress": null,
        "_defaultProvider": null
    },
    "contract_address": "0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba",
    "tx_hash": "0xae12071058be915466e66f1044b889ac0508d580ebfda59773396aaf88c57b21"
}
```

### Burn

Burn requires an `address_for` address that represents the wallet public address that we want to burn the token for. Also make sure to set the `X-API-KEY` for authentication.

```curl
curl --location --request POST 'localhost:3000/burn' \
--header 'X-API-KEY: testKey' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'address_for=0x123address'
```

Response:

```
{
    "network": {
        "name": "bnbt",
        "chainId": 97,
        "ensAddress": null,
        "_defaultProvider": null
    },
    "contract_address": "0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba",
    "tx_hash": "0x698c9601f8647c09e300ca62f3c5d857189d9cf9e61de1881b550649a13f583f"
}
```

### Info

Info returns some useful information about the network being used (the blockchain that runs the smart contract) as well as the contract address and name of the token:

```curl
curl --location --request GET 'localhost:3000/info'
```

Response

```
{
    "network": {
        "name": "bnbt",
        "chainId": 97,
        "ensAddress": null,
        "_defaultProvider": null
    },
    "contract_address": "0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba",
    "name": "Proof of DeFi compliance",
    "symbol": "DEFI"
}
```

### Has

Checks if a wallet has a token. The wallet to test is set in the `url`:

```
curl --location --request GET 'localhost:3000/has/0xCdcc3Ae823F05935f0b9c35C1054e5C144401C0a'
```

Response:

```
{
    "network": {
        "name": "bnbt",
        "chainId": 97,
        "ensAddress": null,
        "_defaultProvider": null
    },
    "contract_address": "0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba",
    "has_token": true
}
```

### Token info

Retrieves the creation timestamp and token uri for a token. The token id is set in the url

```
curl --location --request GET 'localhost:3000/id/0'
```

Response:

```
{
    "network": {
        "name": "bnbt",
        "chainId": 97,
        "ensAddress": null,
        "_defaultProvider": null
    },
    "contract_address": "0x1589257BBfA909B1b3D17148a7a3D27A37ee92ba",
    "token_uri": "ipfs://Qmf8Y4u1hYHaNYdhUUcvtKn3XM8JUk86zeqSjLvRkSoMsu",
    "token_creation_timestamp": 1684916584
}
```
