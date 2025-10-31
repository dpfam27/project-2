import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoami(@Request() req: any) {
    return { user: req.user };
  }

  @Get('hdrs')
  hdrs(@Request() req: any) {
    return { auth: req.headers['authorization'] };
  }
}
