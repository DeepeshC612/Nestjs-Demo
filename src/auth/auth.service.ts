import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePass } from '../constant/hashing';
import { getEnv } from "../constant/environment";
import { VerifyEmailDto } from 'src/validation/user.validation';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  private readonly blacklist: Set<string> = new Set();

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; data: object }> {
    const user = await this.usersService.findOneUser(email);
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
      data: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async verifyToken(query: VerifyEmailDto): Promise<object> {
    try {
      const { token } =  query;
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: getEnv('jwt_secret')
        }
      );
      if(payload) {
        return {
          status: true,
          data: payload?.email,
          message: "Your email is verified successfully"
        };
      } else {
        throw new UnauthorizedException()
      }
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          status: false,
          error: 'Internal server error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }
  isTokenBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
}
