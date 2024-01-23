import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { DataBaseModule } from '../../config/database.module';
import { userProviders } from "./user.provider";
import { UserService } from './users.service';

@Module({
  imports: [DataBaseModule],
  controllers: [UserController],
  providers: [...userProviders, UserService],
})
export class UserModule {}
