import { getEnv } from '../constant/environment';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: getEnv('localhost'),
  port: 3306,
  username: getEnv('db_username'),
  password: getEnv('db_pass'),
  database: getEnv('db_name'),
  synchronize: true,
  logging: false,
  entities: [],
  autoLoadEntities: true,
  migrations: [],
  subscribers: [],
};
export default databaseConfig;