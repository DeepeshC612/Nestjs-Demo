import { DataSource } from 'typeorm';
import { getEnv } from '../constant/environment';
import { provider } from '../constant/provider';

export const AppDataSource = [
  {
    provide: provider.dataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: getEnv('localhost'),
        port: 3306,
        username: getEnv('db_username'),
        password: getEnv('db_pass'),
        database: getEnv('db_name'),
        synchronize: true,
        logging: false,
        entities: ['src/entity/**/*.{js,ts}'],
        migrations: [],
        subscribers: [],
      });
      return dataSource.initialize();
    },
  },
];
