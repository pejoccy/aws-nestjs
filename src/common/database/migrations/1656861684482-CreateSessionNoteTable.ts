import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSessionNoteTable1656861684482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session_note',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'body',
            type: 'varchar',
          },
          {
            name: 'sessionId',
            type: 'integer',
          },
          {
            name: 'creatorId',
            type: 'integer',
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

    await queryRunner.createForeignKeys('session_note', [
      new TableForeignKey({
        name: 'fk_session_note_creatorId_account_id',
        columnNames: ['creatorId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_session_note_sessionId_session_id',
        columnNames: ['sessionId'],
        referencedTableName: 'session',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('session_note');
  }
}
