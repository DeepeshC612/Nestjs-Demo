import { HttpStatus, Injectable, Res, Inject, HttpException } from '@nestjs/common';
import { InsertEvent, Repository } from 'typeorm';
import { User } from '../../models/users/user.entity';
import { UserInterface } from '../../interfaces/user.interfaces'
import { provider } from '../../constant/provider';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @Inject(provider.user)
    private userRepository: Repository<User>,
  ) {}

  async postUser(@Res() req: Request): Promise<void> {
    const { body } = req;
    try {
      await this.userRepository.insert(body);
      
    } catch(error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
  // rejectUser(@Res() res: Response, message: string) {
  //   res.status(HttpStatus.BAD_REQUEST).json({
  //     status: false,
  //     data: {},
  //     message: message,
  //   });
  // }
}
