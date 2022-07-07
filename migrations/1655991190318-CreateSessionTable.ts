import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateSessionTable1655991190318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'session',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'studyDate',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'studyInfo',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'modality',
              type: 'varchar',
              length: '50',
              comment: 'e.g. ct-scan, x-ray, skin e.t.c.'
            },
            {
              name: 'patientId',
              type: 'integer',
            },
            {
              name: 'businessId',
              type: 'integer',
              isNullable: true,
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
              name: 'report',
              type: 'jsonb',
              isNullable: true,
              comment: `'[{"caption": "Clinical information", "description": "Here goes the description.", "sortOrder": 1}]'`,
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
        })
      );

      await queryRunner.createForeignKeys('session', [
        new TableForeignKey({
          name: 'fk_session_patientId_patient_id',
          columnNames: ['patientId'],
          referencedTableName: 'patient',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_session_creatorId_account_id',
          columnNames: ['creatorId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('session');
    }

}
