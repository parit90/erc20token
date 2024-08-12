async function main() {
  const initialSupply = ethers.utils.parseUnits("100", 18); // 1,000,000 tokens with 18 decimals
  const Token = await ethers.getContractFactory("ERC20Token");
  const token = await Token.deploy(initialSupply);
  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
