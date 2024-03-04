import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getEnv } from '../constant/environment';
import { User } from 'src/models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ResetPassGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: getEnv('jwt_secret'),
      });
      const checkToken: User = await this.userRepository.findOne({
        where: { id: payload?.id },
      });
      if (checkToken.resetPasswordToken !== token) {
        throw new ForbiddenException({
          status: false,
          message: 'Invalid token.',
        });
      }
      request.user = payload;
      request.token = token;
    } catch {
      throw new ForbiddenException({
        status: false,
        message: 'Invalid token.',
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
