import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { DataBaseModule } from '../../config/database.module';
import { userProviders } from "./users.provider";
import { UserService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [DataBaseModule],
  controllers: [UserController],
  providers: [...userProviders, UserService],
  exports: [UserService]
})
export class UserModule {}
