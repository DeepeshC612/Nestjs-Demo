import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(@Res() res: Response) {
    //res.status(HttpStatus.CREATED).json({ message: 'heelow' });
    return this.appService.getHello(res);
  }
}
