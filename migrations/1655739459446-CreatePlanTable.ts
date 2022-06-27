import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreatePlanTable1655739459446 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'plan',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'price',
              type: 'integer',
              comment: 'value in kobo, cent, etc',
            },
            {
              name: 'ranking',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'currency',
              type: 'varchar',
              length: '3',
              comment: 'iso-3 currency code',
            },
            {
              name: 'timeUnit',
              type: 'varchar',
              comment: 'month, day, year',
              default: "'month'",
            },
            {
              name: 'validity',
              type: 'integer',
              default: 1,
            },
            {
              name: 'trialTimeUnit',
              type: 'varchar',
              isNullable: true,
              comment: 'month, day, year',
            },
            {
              name: 'trialPeriod',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'boolean',
              default: true,
            },
            {
              name: 'isDefault',
              type: 'boolean',
              default: false,
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
        true
      );

      await queryRunner.createUniqueConstraint(
        'plan',
        new TableUnique({
          name: 'uniq_plan_name',
          columnNames: ['name'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('plan');
    }

}
