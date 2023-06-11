# SoulboundToken Tezos

This is a Smart Contract for storing Verifiable Credentials on the Tezos Blockchain.

We will be using an FA2 contract and modifying it so that:

1. token id auto increments
1. only one type of VC per Smart Contract address (KT1)
1. tokens are not transferable

FA2 Smart Contracts have multiple implementations. We've referred to the following documentation to design ours:

1. [Implementing FA2](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/implementing-fa2.md)
2. [TZIP12 proposal](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md)
3. [Wine collection training](https://github.com/marigold-dev/training-nft-1)
