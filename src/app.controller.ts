import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Base')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/welcome')
  getWelcome(): string {
    return this.appService.getWelcome();
  }

  @Get('/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  healthCheck(): void {}
}
