import { config } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
// import { User } from './user/entities/user.entity';
// import { Permission } from './user/entities/permission.entity';
// import { Role } from './user/entities/role.entity';

console.log('dirname=====', __dirname)
console.log(path.join(__dirname, '.env') )
config({ path: path.join(__dirname, '..', '.env') });
console.log(process.env.mysql_server_password, process.env.mysql_server_host)
console.log(path.join(__dirname, 'migrations/*.js'))

const ormConfigForCli = {
  type: 'mysql',
  host: process.env.mysql_server_host,
  port: parseInt(process.env.mysql_server_port),
  username: process.env.mysql_server_username,
  password: process.env.mysql_server_password,
  database: process.env.mysql_server_database,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/**/*.entity.{ts, js}'],
  // entities: ['/src/**/*.entity.{ts, js}'],
  // entities: [path.join(__dirname, '**', '*.entity.{js,ts}')],
  // entities: [User, Permission, Role],
  // entities: ['src/**/*.entity.ts'],
  migrations: [path.join(__dirname, 'migrations/*.js')],
  connectorPackage: 'mysql2',
  poolSize: 10,
  // logger: 'file',
};

const dataSource = new DataSource(ormConfigForCli as any);

export default dataSource;
