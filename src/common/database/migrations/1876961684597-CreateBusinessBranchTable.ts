import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBusinessBranchTable1876961684597
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_branch',
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
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'countryId',
            type: 'integer',
          },
          {
            name: 'stateId',
            type: 'integer',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'businessId',
            type: 'integer',
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

    await queryRunner.createForeignKeys('business_branch', [
      new TableForeignKey({
        name: 'fk_business_branch_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_branch_countryId_country_id',
        columnNames: ['countryId'],
        referencedTableName: 'country',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_branch_stateId_state_id',
        columnNames: ['stateId'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('business_branch');
  }
}
