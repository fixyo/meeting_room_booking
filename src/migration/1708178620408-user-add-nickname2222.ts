import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddNickname22221708178620408 implements MigrationInterface {
  name = 'UserAddNickname22221708178620408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`nickname2222\` varchar(50) NOT NULL COMMENT 'nickname'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`nickname2222\``,
    );
  }
}
