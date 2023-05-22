import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SoulboundTokens", async () => {
  async function deploySoulboundTokenFixture() {
    const SoulboundTokens = await ethers.getContractFactory("SoulboundTokens");

    const [owner, alice, bob, charly] = await ethers.getSigners();

    const soulboundTokens = await SoulboundTokens.deploy("Talao Over 18 Proof", "TO18P");

    await soulboundTokens.deployed();

    return {
      soulboundTokens,
      owner,
      alice,
      bob,
      charly
    };
  }

  it("Should set the token name", async () => {
    // Given
    const { soulboundTokens } = await loadFixture(deploySoulboundTokenFixture);

    // When

    // Then
    expect(await soulboundTokens.name()).to.equal("Talao Over 18 Proof");
    expect(await soulboundTokens.symbol()).to.equal("TO18P");
  });

  it("Should create a new SBT", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.mint(alice.getAddress(), "ipfs://test");

    // Then
    expect(await soulboundTokens.tokenURI(0)).to.equal("ipfs://test");
  });

  it("Should record the token creation timestamp", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.mint(alice.getAddress(), "ipfs://test");

    // Then
    expect(await soulboundTokens.tokenTimestamp(0)).to.equal(await time.latest());
  });

  it("Should return an error when reading a creation timestamp for a token that hasn't been minted", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When

    // Then
    expect(soulboundTokens.tokenTimestamp(0)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Should tell how many tokens a user has", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await Promise.all([
      await soulboundTokens.mint(alice.getAddress(), "ipfs://test1"),
      await soulboundTokens.mint(alice.getAddress(), "ipfs://test2")
    ]);

    // Then
    expect(await soulboundTokens.balanceOf(alice.getAddress())).to.equal(2);
  });

  it("Should not allow SBTs to be transferrable", async () => {
    // Given
    const { soulboundTokens, alice, bob } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.mint(alice.getAddress(), "ipfs://test");

    expect(soulboundTokens.connect(alice).transferFrom(alice.getAddress(), bob.getAddress(), 0)).to.be.revertedWith(
      "ERC721: Cannot transfer SoulboundToken."
    );
  });

  it("Should not allow SBT owner to burn it", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);

    // When
    await soulboundTokens.mint(alice.getAddress(), "ipfs://test");

    expect(soulboundTokens.connect(alice).burn(0)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow contract owner to burn an SBT", async () => {
    // Given
    const { soulboundTokens, alice } = await loadFixture(deploySoulboundTokenFixture);
    await soulboundTokens.mint(alice.getAddress(), "ipfs://test");

    // When
    await soulboundTokens.burn(0);

    // Then
    expect(await soulboundTokens.balanceOf(alice.getAddress())).to.equal(0);
  });

  it("Should allow to retrieve a token by id", async () => {
    // Given
    const { soulboundTokens, alice, bob } = await loadFixture(deploySoulboundTokenFixture);

    await soulboundTokens.mint(alice.getAddress(), "ipfs://test1");
    await soulboundTokens.mint(bob.getAddress(), "ipfs://test2");
    await soulboundTokens.mint(bob.getAddress(), "ipfs://test3");

    // When
    const tokenId = await soulboundTokens.tokenOfOwnerByIndex(bob.getAddress(), 1);

    // Then
    expect(await soulboundTokens.tokenURI(tokenId)).to.equal("ipfs://test3");
  });
});
