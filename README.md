***
根据entitiy生成对应的migrations
$ npm run mi:gen ./src/migration/init-sql
执行对应的migrations在数据库中创建表并添加执行记录
npm run mi:run 

> No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command
没有找到对应的实体, 一般是文件路径错误