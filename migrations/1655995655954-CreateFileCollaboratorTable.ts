import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateFileCollaboratorTable1655995655954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'file_collaborator',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'accountId',
              type: 'uuid',
            },
            {
              name: 'fileId',
              type: 'uuid',
            },
            {
              name: 'permission',
              type: 'varchar',
              default: `'read-write'`,
              comment: 'e.g. read-write, readonly',
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
        'file_collaborator',
        new TableUnique({
          name: 'uniq_file_collaborator_fileId_accountId',
          columnNames: ['fileId', 'accountId'],
        })
      );

      await queryRunner.createForeignKeys('file_collaborator', [
        new TableForeignKey({
          name: 'fk_file_collaborator_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_file_collaborator_folderId_folder_id',
          columnNames: ['fileId'],
          referencedTableName: 'file',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('file_collaborator');
    }

}
