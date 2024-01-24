import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../api/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { getEnv } from '../constant/environment';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: getEnv('jwt_secret'),
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}