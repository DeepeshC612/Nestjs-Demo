import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { BatsModule } from './bats/bats.module';

@Module({
  imports: [BatsModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
