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

    // Deploy with an initial supply of 1,000,000 tokens (considering 18 decimals)
    token = await Token.deploy(ethers.utils.parseUnits("1000000", 18));
  });

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, ethers.utils.parseUnits("50", 18));
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", 18));

    await token.connect(addr1).transfer(addr2.address, ethers.utils.parseUnits("50", 18));
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", 18));
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await expect(
      token.connect(addr1).transfer(owner.address, ethers.utils.parseUnits("1000000", 18))
    ).to.be.revertedWith("ERC20InsufficientBalance");

    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });

  it("Should update balances after transfers", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    await token.transfer(addr1.address, ethers.utils.parseUnits("100", 18));
    await token.transfer(addr2.address, ethers.utils.parseUnits("50", 18));

    const finalOwnerBalance = await token.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseUnits("150", 18)));

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseUnits("100", 18));

    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", 18));
  });

  it("Should allow owner to mint tokens", async function () {
    const initialSupply = await token.totalSupply();
    await token.mint(addr1.address, ethers.utils.parseUnits("500", 18));
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseUnits("500", 18));

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(initialSupply.add(ethers.utils.parseUnits("500", 18)));
  });

  it("Should allow owner to burn tokens", async function () {
    const initialSupply = await token.totalSupply();
    const burnAmount = ethers.utils.parseUnits("200", 18);
    await token.burn(burnAmount);
    
    const ownerBalance = await token.balanceOf(owner.address);
    const expectedBalance = initialSupply.sub(burnAmount);
    expect(ownerBalance).to.equal(expectedBalance);

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(initialSupply.sub(burnAmount));
});


  it("Should not allow non-owners to mint tokens", async function () {
    await expect(
      token.connect(addr1).mint(addr1.address, ethers.utils.parseUnits("500", 18))
    ).to.be.revertedWith("OwnableUnauthorizedAccount");
  });

  it("Should not allow non-owners to burn tokens", async function () {
    await expect(
      token.connect(addr1).burn(ethers.utils.parseUnits("200", 18))
    ).to.be.revertedWith("OwnableUnauthorizedAccount");
  });

  it("Should handle minting with edge cases", async function () {
      await expect(
        token.mint(owner.address, ethers.constants.MaxUint256)
      ).to.be.revertedWith("panic code 0x11");
  });
});
