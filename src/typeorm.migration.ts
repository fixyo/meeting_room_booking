import 'reflect-metadata'
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
Permission
import { Role } from './user/entities/role.entity';
console.log('dirname: ', __dirname)
console.log(path.join(__dirname, '/**/entities/*.entity.js'))
config({ path: path.join(__dirname, '..', '.env') });
console.log('migrationPath:', path.join(__dirname, 'migrations/*.js'))

const ormConfigForCli:DataSourceOptions = {
  type: 'mysql',
  host: process.env.mysql_server_host,
  port: parseInt(process.env.mysql_server_port),
  username: process.env.mysql_server_username,
  password: process.env.mysql_server_password,
  database: process.env.mysql_server_database,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '/**/*.entity.js')],
  // entities: [User, Permission, Role],
  migrations: [path.join(__dirname, 'migration/*.js')],
  // migrations: ['./src/migration/**.ts'],
  connectorPackage: 'mysql2',
  poolSize: 10,
  // logger: 'file',
};

const dataSource = new DataSource(ormConfigForCli);

export default dataSource;
