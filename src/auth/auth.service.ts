import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePass } from '../constant/hashing';
import { VerifyEmailDto } from 'src/validation/user.validation';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  /**
   * User login
   * @param email
   * @param pass
   * @returns
   */
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; data: object, status: boolean }> {
    try {
      const user = await this.usersService.findOneUser(email);
      if (!user) {
        throw new HttpException(
          {
            status: false,
            error: 'User not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const passCheck = await comparePass(pass, user?.password);
      if (!passCheck) {
        throw new HttpException(
          {
            status: false,
            error: 'Invalid credentials',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = { ...user };
      delete user?.password;
      return {
        status: true,
        data: user,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
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
   * Verify email otp
   * @param body
   * @returns
   */
  async verifyOtp(body: VerifyEmailDto): Promise<object> {
    try {
      const { otp, email } = body;
      const getUser = await this.usersService.getUser(email);
      if (getUser?.isVerified) {
        throw new HttpException(
          {
            status: false,
            error: 'Email is already verified.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (getUser?.emailOtp !== otp) {
        throw new HttpException(
          {
            status: false,
            error: 'Invalid otp.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.usersService.update(getUser?.id, { isVerified: true });
      return {
        status: true,
        data: getUser?.email,
        message: 'Your email is verified successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
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
