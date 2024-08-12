import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('total-supply')
  getTotalSupply() {
    return this.tokenService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string) {
    return this.tokenService.getBalance(address);
  }

  @Post('transfer')
  transferTokens(
    @Body('to') to: string,
    @Body('amount') amount: string,
  ) {
    return this.tokenService.transferTokens(to, amount);
  }

  @Post('mint')
  mintTokens(
    @Body('to') to: string,
    @Body('amount') amount: string,
  ) {
    return this.tokenService.mintTokens(to, amount);
  }

  @Post('burn')
  burnTokens(@Body('amount') amount: string) {
    return this.tokenService.burnTokens(amount);
  }

  @Get('info')
  async getTokenInfo() {
    return await this.tokenService.getTokenInfo();
  }
}
