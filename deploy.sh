#!/bin/sh

 cd ./sbt-contract-evm

contract_address_eth=$(npx hardhat run --network deployNetwork ./scripts/deploy.ts)

export SBT_CONTRACT=$contract_address_eth
export POLYGONPOS_SBT_CONTRACT=$contract_address_eth
export ETHEREUM_SBT_CONTRACT=$contract_address_eth

cd ..
cd ./sbt-contract-tz

export TEZOS_SBT_CONTRACT_ADDRESS=$(npm run -s deploy)

cd ..