import { expectRevert } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("SoulboundTokens", async () => {
  async function deploySoulboundTokenFixture() {
    const SoulboundTokens = await ethers.getContractFactory("SoulboundTokens");
    const [owner, alice, bob, charly] = await ethers.getSigners();

    const soulboundTokens = await SoulboundTokens.deploy();

    await soulboundTokens.deployed();

    return {
      soulboundTokens,
      owner,
      alice,
      bob,
      charly
    };
  }

  it("Should create a new SBT", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test");

    // Then
    expect(await soulboundTokens.tokenURI(0)).to.equal("ipfs://test");
  });

  it("Should tell how many tokens a user has", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await Promise.all([
      await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test1"),
      await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test2")
    ]);

    // Then
    expect(await soulboundTokens.balanceOf(alice.getAddress())).to.equal(2);
  });

  it("Should not allow SBTs to be transferrable", async () => {
    // Given
    const { soulboundTokens, alice, bob } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test");

    await expectRevert(
      soulboundTokens.connect(alice).transferFrom(alice.getAddress(), bob.getAddress(), 0),
      "ERC721: Cannot transfer SoulboundToken"
    );
  });

  it("Should not allow SBT owner to burn it", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test");

    await expectRevert(soulboundTokens.connect(alice).burn(0), "Ownable: caller is not the owner");
  });

  it("Should allow contract owner to burn an SBT", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);
    await soulboundTokens.safeMint(alice.getAddress(), "ipfs://test");

    // When
    await soulboundTokens.burn(0);

    // Then
    expect(await soulboundTokens.balanceOf(alice.getAddress())).to.equal(0);
  });
});
