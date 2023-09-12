import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBusinessContractorTable1876996897145
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_contractor',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'specialistId',
            type: 'integer',
          },
          {
            name: 'specializationId',
            type: 'integer',
          },
          {
            name: 'role',
            type: 'varchar',
          },
          {
            name: 'businessId',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdBy',
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

    await queryRunner.createForeignKeys('business_contractor', [
      new TableForeignKey({
        name: 'fk_business_contractor_specialistId_specialist_id',
        columnNames: ['specialistId'],
        referencedTableName: 'specialist',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_contractor_specializationId_specialization_id',
        columnNames: ['specializationId'],
        referencedTableName: 'specialization',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_contractor_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('business_contractor');
  }
}
