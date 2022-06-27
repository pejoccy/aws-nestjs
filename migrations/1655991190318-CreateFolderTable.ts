import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateFolderTable1655991190318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'folder',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'modality',
              type: 'varchar',
              comment: 'e.g. ct-scan, x-ray, e.t.c.'
            },
            {
              name: 'accountId',
              type: 'uuid',
            },
            {
              name: 'sharing',
              type: 'varchar',
              default: `'private'`,
              comment: 'e.g. private, public'
            },
            {
              name: 'status',
              type: 'boolean',
              default: true,
            },
            {
              name: 'createdBy',
              type: 'uuid',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'deletedAt',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        })
      );

      await queryRunner.createUniqueConstraint(
        'folder',
        new TableUnique({
          name: 'uniq_folder_accountId_name',
          columnNames: ['accountId', 'name'],
        })
      );

      await queryRunner.createForeignKeys('folder', [
        new TableForeignKey({
          name: 'fk_folder_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('folder');
    }

}
