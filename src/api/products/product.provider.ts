import { DataSource } from 'typeorm';
import { Product } from '../../models/products/product.entity';
import { provider } from '../../constant/provider';

export const productProvider = [
  {
    provide: provider.product,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [provider.dataSource],
  },
];
