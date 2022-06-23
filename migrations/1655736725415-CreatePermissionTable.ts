import { MigrationInterface, QueryRunner, Table, TableUnique } from "typeorm";

export class CreatePermissionTable1655736725415 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'permission',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'slug',
              type: 'varchar',
            },
            {
              name: 'name',
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
        'permission',
        new TableUnique({
          name: 'uniq_permission_slug',
          columnNames: ['slug'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('permission');
    }

}
