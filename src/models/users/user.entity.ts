import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRoles } from '../../constant/constants';
import { Product } from '../products/product.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column()
  profilePic: string;

  @Column({ length: 20 })
  phoneNum: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @OneToMany(() => Product, (product) => product.user)
  photos: Product[];
}
