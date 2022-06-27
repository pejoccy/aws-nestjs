import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateFolderCollaboratorTable1655995645341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'folder_collaborator',
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
              name: 'folderId',
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
        'folder_collaborator',
        new TableUnique({
          name: 'uniq_folder_collaborator_folderId_accountId',
          columnNames: ['folderId', 'accountId'],
        })
      );

      await queryRunner.createForeignKeys('folder_collaborator', [
        new TableForeignKey({
          name: 'fk_folder_collaborator_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_folder_collaborator_folderId_folder_id',
          columnNames: ['folderId'],
          referencedTableName: 'folder',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('folder_collaborator');
    }
}
