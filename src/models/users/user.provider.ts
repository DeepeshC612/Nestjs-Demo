import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { provider } from '../../constant/provider';

export const photoProviders = [
  {
    provide: provider.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [provider.dataSource],
  },
];
