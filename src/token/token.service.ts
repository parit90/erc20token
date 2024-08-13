import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import * as tokenAbi from '../../artifacts/contracts/ERC20Token.sol/ERC20Token.json';

@Injectable()
export class TokenService {
  private contract: Contract;

  constructor() {
    const provider = new ethers.providers.JsonRpcProvider('http://hardhat:8545');
    console.log('Private Key: ', process.env.PRIVATE_KEY);
    console.log('TOKEN_CONTRACT_ADDRESS: ', process.env.TOKEN_CONTRACT_ADDRESS,);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    this.contract = new ethers.Contract(
      process.env.TOKEN_CONTRACT_ADDRESS,
      tokenAbi.abi,
      wallet,
    );
  }

  async getTotalSupply(): Promise<string> {
    console.log('-------------------getTotalSupply');
    return ethers.utils.formatUnits(await this.contract.totalSupply(), 18);
  }

  async getBalance(address: string): Promise<string> {
    return ethers.utils.formatUnits(await this.contract.balanceOf(address));
  }

  async transferTokens(to: string, amount: string): Promise<string> {
    const tx = await this.contract.transfer(to, ethers.utils.parseUnits(amount, 18));
    return tx.hash;
  }

  async mintTokens(to: string, amount: string): Promise<string> {
    const tx = await this.contract.mint(to, ethers.utils.parseUnits(amount, 18));
    return tx.hash;
  }

  async burnTokens(amount: string): Promise<string> {
    const tx = await this.contract.burn(ethers.utils.parseUnits(amount, 18));
    return tx.hash;
  }

  async getTokenInfo(): Promise<any> {
    const name = await this.contract.name();
    const symbol = await this.contract.symbol();
    const decimals = await this.contract.decimals();
    const totalSupply = await this.contract.totalSupply();
    const owner = await this.contract.owner();
    const ownerBalance = await this.contract.balanceOf(owner);

    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.utils.formatUnits(totalSupply, decimals), // Adjust for decimals
      owner,
      ownerBalance: ethers.utils.formatUnits(ownerBalance, decimals),
      contractAddress: this.contract.address,
    };
  }
}
