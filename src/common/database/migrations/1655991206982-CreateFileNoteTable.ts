import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateFileNoteTable1655991206982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'file_note',
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
            name: 'fileId',
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

    await queryRunner.createForeignKeys('file_note', [
      new TableForeignKey({
        name: 'fk_file_note_creatorId_account_id',
        columnNames: ['creatorId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_file_note_fileId_file_id',
        columnNames: ['fileId'],
        referencedTableName: 'file',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('file_note');
  }
}
