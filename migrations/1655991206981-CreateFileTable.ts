import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateFileTable1655991206981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'file',
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
              name: 'resourceId',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'resourceUri',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'accountId',
              type: 'uuid',
            },
            {
              name: 'folderId',
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
              type: 'varchar',
              default: `'pending'`,
              comment: 'e.g. pending, uploading, uploaded, invalid',
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
        'file',
        new TableUnique({
          name: 'uniq_file_accountId_folderId_name',
          columnNames: ['accountId', 'folderId', 'name'],
        })
      );

      await queryRunner.createForeignKeys('file', [
        new TableForeignKey({
          name: 'fk_file_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_file_folderId_folder_id',
          columnNames: ['folderId'],
          referencedTableName: 'folder',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('file');
    }

}
