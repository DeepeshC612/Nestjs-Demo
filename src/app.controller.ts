import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request): string {
    return this.appService.getHello();
  }
}
