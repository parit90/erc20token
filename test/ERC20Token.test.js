const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ERC20Token");
    [owner, addr1, addr2] = await ethers.getSigners();

    token = await Token.deploy(1000000); // Deploy with an initial supply of 1,000,000 tokens
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, 50);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(50);

    await token.connect(addr1).transfer(addr2.address, 50);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await expect(
      token.connect(addr1).transfer(owner.address, 1000000)
    ).to.be.revertedWith("ERC20InsufficientBalance");

    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });

  it("Should update balances after transfers", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await token.transfer(addr1.address, 100);
    await token.transfer(addr2.address, 50);

    const finalOwnerBalance = await token.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(100);

    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });

  it("Should allow owner to mint tokens", async function () {
    await token.mint(addr1.address, 500);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(500);

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(1000000 + 500);
  });

  it("Should allow owner to burn tokens", async function () {
    await token.burn(200);
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1000000 - 200);

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(1000000 - 200);
  });

  it("Should not allow non-owners to mint tokens", async function () {
    await expect(
      token.connect(addr1).mint(addr1.address, 500)
    ).to.be.revertedWith("OwnableUnauthorizedAccount");
  });

  it("Should not allow non-owners to burn tokens", async function () {
    await expect(
      token.connect(addr1).burn(200)
    ).to.be.revertedWith("OwnableUnauthorizedAccount");
  });

  it("Should handle minting with edge cases", async function () {
      await expect(
        token.mint(owner.address, ethers.constants.MaxUint256)
      ).to.be.revertedWith("panic code 0x11");
   });
});
