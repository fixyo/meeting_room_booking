import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: 'role name',
  })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
