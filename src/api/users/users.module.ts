import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer';
import { MailModule } from 'src/services/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from '../../constant/environment';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register(multerConfig),
    MailModule,
    JwtModule.register({
      global: true,
      secret: getEnv('jwt_secret'),
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
