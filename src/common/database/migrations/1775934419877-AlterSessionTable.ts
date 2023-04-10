import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterSessionTable1775934419877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'session',
      new TableColumn({
        name: 'sessionStatus',
        type: 'varchar',
        length: '15',
        default: `'Created'`,
        comment: 'e.g. Created, Completed, Updated',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('session', 'sessionStatus');
  }
}
