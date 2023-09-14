#!/bin/sh

pushd ./sbt-contract-evm

contract_address_eth=$(npx hardhat run --network deployNetwork ./scripts/deploy.ts)

SBT_CONTRACT=$contract_address_eth
POLYGONPOS_SBT_CONTRACT=$contract_address_eth
ETHEREUM_SBT_CONTRACT=$contract_address_eth

export SBT_CONTRACT
export POLYGONPOS_SBT_CONTRACT
export ETHEREUM_SBT_CONTRACT

popd
pushd ./sbt-contract-tz

TEZOS_SBT_CONTRACT_ADDRESS=$(npm run -s deploy)

export TEZOS_SBT_CONTRACT_ADDRESS

popd