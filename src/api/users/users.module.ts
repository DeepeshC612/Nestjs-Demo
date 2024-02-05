import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MulterModule.register(multerConfig)], 
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
