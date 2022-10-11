import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateSessionCollaboratorTable1655995645341
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session_collaborator',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'accountId',
            type: 'integer',
          },
          {
            name: 'sessionId',
            type: 'integer',
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
      }),
    );

    await queryRunner.createUniqueConstraint(
      'session_collaborator',
      new TableUnique({
        name: 'uniq_session_collaborator_sessionId_accountId',
        columnNames: ['sessionId', 'accountId'],
      }),
    );

    await queryRunner.createForeignKeys('session_collaborator', [
      new TableForeignKey({
        name: 'fk_session_collaborator_accountId_account_id',
        columnNames: ['accountId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_session_collaborator_sessionId_session_id',
        columnNames: ['sessionId'],
        referencedTableName: 'session',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('session_collaborator');
  }
}
