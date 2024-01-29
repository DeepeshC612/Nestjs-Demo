import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePass } from '../constant/hashing';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

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
}
