import { ethers } from "hardhat";

async function main() {
  const SoulboundTokens = await ethers.getContractFactory("SoulboundTokens");
  const soulboundTokens = await SoulboundTokens.deploy("Proof of DeFi compliance", "DEFI");

  await soulboundTokens.deployed();

  console.warn(`soulboundTokens deployed at ${soulboundTokens.address}`);
  console.log(soulboundTokens.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
