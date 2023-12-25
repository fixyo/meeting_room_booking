import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddGender1703490803926 implements MigrationInterface {
  name = 'UserAddGender1703490803926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`gender\` enum ('0', '1') NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
  }
}
