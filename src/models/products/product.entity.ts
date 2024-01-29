import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  productName: string;

  @Column()
  price: number;

  @Column({ length: 1000 })
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
