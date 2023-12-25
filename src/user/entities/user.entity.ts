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
import * as dayjs from 'dayjs';

enum Gender {
  male = 0,
  female = 1,
}
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
    type: 'enum',
    enum: Gender,
    default: Gender.male,
  })
  gender: Gender;

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
    length: 150,
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

  @CreateDateColumn({
    transformer: {
      from: (v) => {
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
      },
      to: (v) => {
        return v;
      },
    },
  })
  createAt: Date;

  @UpdateDateColumn({
    transformer: {
      from: (v) => {
        // console.log('exxx', v);
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
      },
      to: (v) => {
        return v;
      },
    },
  })
  updateAt: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    // inverseJoinColumn: { name: 'rolessId' },
    // joinColumn: { name: 'rolessId' },
  })
  roless: Role[];
}
