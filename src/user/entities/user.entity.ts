import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: 'user name',
  })
  username: string;

  @Column({
    length: 50,
    comment: 'password',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: 'nickname',
  })
  nickname: string;

  @Column({
    comment: 'email',
    length: 70,
  })
  email: string;

  @Column({
    comment: 'avatar',
    length: 100,
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: 'phone number',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    comment: 'is frozen',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: 'is adamin',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToMany((type) => Role)
  @JoinTable({
    name: 'user_roles',
    // inverseJoinColumn: { name: 'rolessId' },
    // joinColumn: { name: 'rolessId' },
  })
  roless: Role[];
}
