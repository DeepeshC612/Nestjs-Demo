import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';

@Injectable()
export class UserExistsCheck implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const isExists: User = await this.userRepository.findOne({
        where: { email: request?.body?.email },
      });
      if (!isExists) {
        throw new ForbiddenException({
          status: false,
          message: 'User not found with this email address.',
        });
      }
      request.user = isExists
    } catch {
      throw new ForbiddenException({
        status: false,
        message: 'User not found.',
      });
    }
    return true;
  }
}
