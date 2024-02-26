import { Injectable, Res } from '@nestjs/common';
import { Response, response } from 'express';

@Injectable()
export class AppService {
  getHello() {
   return { message: "hello...." };
  }
}
