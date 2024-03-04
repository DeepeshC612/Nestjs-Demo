import { HttpStatus, Injectable, Inject, HttpException } from '@nestjs/common';
import { DeleteResult, Or, Repository, UpdateResult } from 'typeorm';
import { User } from '../../models/user.entity';
import { hashPassword } from '../../constant/hashing';
import { EmailType } from '../../constant/constants';
import {
  CreateUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from '../../validation/user.validation';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../services/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // provider.user
    private userRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
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
        await this.sendConfirmationMail(req.email);
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
   * Send confirmation email
   * @email string
   * @returns boolean
   */
  async sendConfirmationMail(email: string): Promise<Boolean> {
    try {
      const getUser: User = await this.getUser(email);
      if (getUser) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await this.userRepository.update(
          { id: getUser?.id },
          { emailOtp: otp },
        );
        await this.mailService.sendUserConfirmation(
          getUser,
          otp,
          EmailType.CONFIRMATION,
        );
        return true;
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Unable to send email',
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
   * Forget password email
   * @req request
   * @returns
   */
  async forgetPassword(body: ForgetPasswordDto, req: any): Promise<object> {
    try {
      if (req?.user) {
        const payload = { ...req?.user };
        const token = await this.jwtService.signAsync(payload);
        await this.userRepository.update(
          { id: req?.user?.id },
          { resetPasswordToken: token },
        );
        await this.mailService.sendResetPasswordLink(body?.email, token);
        return { status: true, message: 'Email send successfully.' };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Unable to send email.',
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
   * Forget password email
   * @req request
   * @returns
   */
  async resetPassword(req: any, body: ResetPasswordDto): Promise<object> {
    try {
      if (body.password == body.confirmPassword) {
        const newPassword = await hashPassword(body.password);
        const result: UpdateResult = await this.userRepository
          .createQueryBuilder()
          .update()
          .set({ password: newPassword })
          .where('id = :id', { id: req?.user?.id })
          .execute();
        if (result.affected == 1) {
          await this.mailService.sendUserConfirmation(
            req?.user,
            0,
            EmailType.RESETPASSWORD,
          );
          await this.userRepository.update(
            { id: req?.user?.id },
            { resetPasswordToken: null },
          );
          return {
            status: true,
            data: {},
            message: 'Password reset successfully.',
          };
        } else {
          throw new HttpException(
            {
              status: false,
              error: 'Error in resting password.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Both password should match.',
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
   * update profile
   * @req request
   * @body body
   * @profilePic profilePic
   * @returns
   */
  async updateUser(
    body: UpdateProfileDto,
    req: any,
    profilePic: Express.Multer.File,
  ): Promise<object> {
    try {
      const { name, password, phoneNum } = body;
      let updateProperties = {};
      if (name) {
        updateProperties['name'] = name;
      }
      if (password) {
        const newPassword = await hashPassword(password);
        updateProperties['password'] = newPassword;
      }
      if (phoneNum) {
        updateProperties['phoneNum'] = phoneNum;
      }
      if (profilePic) {
        updateProperties['profilePic'] = profilePic?.path;
      }
      const isNumExists = await this.userRepository.findOne({
        where: { phoneNum: phoneNum },
      });
      if (isNumExists) {
        throw new HttpException(
          {
            status: false,
            error: 'Phone number already taken',
          },
          HttpStatus.CONFLICT,
        );
      }
      const result: UpdateResult = await this.userRepository
        .createQueryBuilder()
        .update()
        .set(updateProperties)
        .where('id = :id', { id: req?.user?.id })
        .execute();
      if (result.affected == 1) {
        return {
          status: true,
          data: {},
          message: 'Profile updated successfully',
        };
      } else {
        throw new HttpException(
          {
            status: false,
            error: 'Profile and can not be updated',
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
   * update user
   * @params data
   * @returns
   */
  async update(id: number, data: object): Promise<boolean> {
    try {
      const result: UpdateResult = await this.userRepository.update({ id: id }, data);
      if (result.affected == 1) {
        return true;
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
