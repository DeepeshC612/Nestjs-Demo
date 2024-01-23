import {
  HttpStatus,
  Injectable,
  Inject,
  HttpException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../models/users/user.entity';
import { provider } from '../../constant/provider';
import { Request } from 'express';
import { hashPassword, comparePass } from "../../constant/hashing";

@Injectable()
export class UserService {
  constructor(
    @Inject(provider.user)
    private userRepository: Repository<User>,
  ) {}

  /**
   * User signup
   * @req request 
   * @returns 
   */
  async postUser(req: Request): Promise<object> {
    const { body, body: { password } } = req;
    try {
      const isExists: User = await this.userRepository.findOne({
        where: { email: body.email },
      });
      if (isExists) {
        throw new HttpException(
          {
            status: false,
            error: 'User already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        body.password = await hashPassword(password)
        await this.userRepository.insert(body);
        return { status: true, message: 'User created successfully' };
      }
    } catch (error) {
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

  /**
   * Get user details
   * @param email 
   * @returns 
   */
  async getUser(email: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findOne({
        where: { email: email },
      });
      if (user) {
        return user;
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
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
  
}
