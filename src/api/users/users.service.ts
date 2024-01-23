import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UserService {
  postUser(@Res() res: Response) {
    res.status(HttpStatus.CREATED).json({
      status: true,
      data: {},
      message: 'User created successfully',
    });
  }
  rejectUser(@Res() res: Response, message: string) {
    res.status(HttpStatus.BAD_REQUEST).json({
      status: false,
      data: {},
      message: message,
    });
  }
}
