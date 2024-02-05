import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { DeleteResult, Or, Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { provider } from '../../constant/provider';
import { hashPassword, comparePass } from '../../constant/hashing';
import { CreateUserDto, LoginUserDto } from '../../validation/user.validation';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // provider.user
    private userRepository: Repository<User>,
  ) {}

  /**
   * User signup
   * @req request
   * @returns
   */
  async postUser(
    req: CreateUserDto,
    profilePic: Express.Multer.File,
  ): Promise<object> {
    const { password } = req;
    try {
      const isExists: User = await this.userRepository.findOne({
        where: [{ email: req.email }, { phoneNum: req.phoneNum }],
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
        req.profilePic = profilePic?.path;
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
   * Delete user
   * @req request
   * @returns
   */
  async deleteUser(id: number): Promise<object> {
    try {
      const result: DeleteResult = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', {
          id: id,
        })
        .execute();
      if (result.affected == 1) {
        return { status: true, data: {}, message: 'User deleted successfully' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Unable to delete user',
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
  /**
   * Find one user
   * @request email
   * @returns
   */
  async findOneUser(email: string): Promise<User> {
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
