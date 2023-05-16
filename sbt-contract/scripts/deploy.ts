import { ethers } from "hardhat";

async function main() {
  const SoulboundTokens = await ethers.getContractFactory("SoulboundTokens");
  const soulboundTokens = await SoulboundTokens.deploy("Talao Test Over 18 Proof Token", "TTO18P");

  await soulboundTokens.deployed();

  console.log(`soulboundTokens deployed to ${soulboundTokens.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
