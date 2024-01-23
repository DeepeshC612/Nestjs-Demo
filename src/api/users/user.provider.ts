import { DataSource } from 'typeorm';
import { User } from '../../models/users/user.entity';
import { provider } from '../../constant/provider';

export const userProviders = [
  {
    provide: provider.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [provider.dataSource],
  },
];
