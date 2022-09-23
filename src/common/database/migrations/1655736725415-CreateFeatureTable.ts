import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateFeatureTable1655736725415 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'feature',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'description',
              type: 'varchar',
            },
            {
              name: 'slug',
              type: 'varchar',
            },
            {
              name: 'unit',
              type: 'varchar',
            },
            {
              name: 'status',
              type: 'boolean',
              default: true,
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
        'feature',
        new TableUnique({
          name: 'uniq_feature_slug',
          columnNames: ['slug'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('feature');
    }

}
