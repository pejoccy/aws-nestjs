import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateSessionReportTable1656861684597 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'session_report',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'sessionId',
              type: 'integer',
            },
            {
              name: 'specialistId',
              type: 'integer',
            },
            {
              name: 'report',
              type: 'jsonb',
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

      // await queryRunner.createUniqueConstraint(
      //   'session_report',
      //   new TableUnique({
      //     name: 'uniq_session_report_sessionId_specialistId',
      //     columnNames: ['sessionId', 'specialistId'],
      //   })
      // );

      await queryRunner.createForeignKeys('session_report', [
        new TableForeignKey({
          name: 'fk_session_report_sessionId_session_id',
          columnNames: ['sessionId'],
          referencedTableName: 'session',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_session_report_specialistId_specialist_id',
          columnNames: ['specialistId'],
          referencedTableName: 'specialist',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('session_report');
    }
}
