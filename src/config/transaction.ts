import { Injectable } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class DbTransaction {
  private queryRunner: QueryRunner;

  constructor(private readonly connection: Connection) {}

  async start(): Promise<QueryRunner> {
    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }

  async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    await this.queryRunner.release();
  }
}
