import { Module } from '@nestjs/common';
import { AppDataSource } from './database';

@Module({
  providers: [...AppDataSource],
  exports: [...AppDataSource],
})
export class DataBaseModule {}
