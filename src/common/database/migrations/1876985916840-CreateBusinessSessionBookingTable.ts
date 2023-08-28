import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBusinessSessionBookingTable1876985916840
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_session_booking',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'patientId',
            type: 'integer',
          },
          {
            name: 'businessId',
            type: 'integer',
          },
          {
            name: 'clinicalSummary',
            type: 'varchar',
          },
          {
            name: 'differentialDiagnosis',
            type: 'varchar',
          },
          {
            name: 'comment',
            type: 'varchar',
          },
          {
            name: 'referredById',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'sessionId',
            type: 'integer',
          },
          {
            name: 'referredToBizId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'referredToBizBranchId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'createdById',
            type: 'integer',
            isNullable: true,
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

    await queryRunner.createForeignKeys('business_session_booking', [
      new TableForeignKey({
        name: 'fk_business_session_booking_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_session_booking_patientId_patient_id',
        columnNames: ['patientId'],
        referencedTableName: 'patient',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_session_booking_sessionId_session_id',
        columnNames: ['sessionId'],
        referencedTableName: 'session',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_session_booking_referredToBizId_business_id',
        columnNames: ['referredToBizId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_session_booking_referredToBizBranchId_business_id',
        columnNames: ['referredToBizBranchId'],
        referencedTableName: 'business_branch',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('business_session_booking');
  }
}
