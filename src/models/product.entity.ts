import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  productName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ length: 1000 })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
