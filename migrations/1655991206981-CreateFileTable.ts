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
              type: 'int',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'modalitySection',
              type: 'varchar',
              isNullable: true,
              comment: 'e.g. brain for ct-scan, chest for x-ray, hand for skin e.t.c.'
            },
            {
              name: 'hash',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'url',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'previewUrl',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'ext',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'mime',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'size',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'provider',
              type: 'varchar',
              isNullable: true,
              comment: 'e.g. local, aws, digital ocean',
            },
            {
              name: 'sharing',
              type: 'varchar',
              default: `'private'`,
              comment: 'e.g. private, public'
            },
            {
              name: 'patientId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'sessionId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'creatorId',
              type: 'integer',
            },
            {
              name: 'status',
              type: 'varchar',
              default: `'pending'`,
              comment: 'e.g. pending, uploading, uploaded, invalid',
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
          name: 'uniq_file_patientId_sessionId_name',
          columnNames: ['patientId', 'sessionId', 'name'],
        })
      );

      await queryRunner.createForeignKeys('file', [
        new TableForeignKey({
          name: 'fk_file_patientId_patient_id',
          columnNames: ['patientId'],
          referencedTableName: 'patient',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_file_sessionId_session_id',
          columnNames: ['sessionId'],
          referencedTableName: 'session',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_file_creatorId_account_id',
          columnNames: ['creatorId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('file');
    }

}
