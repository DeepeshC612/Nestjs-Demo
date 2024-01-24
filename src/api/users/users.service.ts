import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { Or, Repository } from 'typeorm';
import { User } from '../../models/users/user.entity';
import { provider } from '../../constant/provider';
import { hashPassword, comparePass } from '../../constant/hashing';
import { CreateUserDto, LoginUserDto } from '../../validation/user.validation';

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
  async postUser(req: CreateUserDto): Promise<object> {
    const { password } = req;
    try {
      const isExists: User = await this.userRepository.findOne({
        where: [
          { email: req.email }, { phoneNum: req.phoneNum }
        ],
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
        req.password = await hashPassword(password);
        await this.userRepository.insert(req);
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
   * User Login
   * @req request
   * @returns
   */
  async postUserLogin(req: LoginUserDto): Promise<object> {
    // const { body } = req;
    try {
      const isExists: User = await this.userRepository.findOne({
        where: { email: req.email },
      });
      if (isExists) {
        const passCheck = await comparePass(req.password, isExists?.password);
        if (!passCheck) {
          throw new HttpException(
            {
              status: false,
              error: 'Invalid credentials',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        delete isExists.password;
        return { status: true, data: isExists, message: 'Login success' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'User not found',
          },
          HttpStatus.BAD_REQUEST,
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
      if (!user) {
        throw new HttpException(
          {
            status: false,
            error: 'User not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
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
