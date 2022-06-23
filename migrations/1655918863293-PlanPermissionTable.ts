import { permissionSeedData } from 'seeders/permissions';
import { planSeedData } from 'seeders/plans';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';
import { Permission } from '../src/common/permission/permission.entity';
import { Plan } from '../src/common/plan/plan.entity';

export class PlanPermissionTable1655918863293 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'plan_permission',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'planId',
              type: 'uuid',
            },
            {
              name: 'permissionId',
              type: 'uuid',
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
        'plan_permission',
        new TableUnique({
          name: 'uniq_subscription_planId_permissionId',
          columnNames: ['planId', 'permissionId'],
        })
      );

      await queryRunner.createForeignKeys('plan_permission', [
        new TableForeignKey({
          name: 'fk_plan_permission_permissionId_permission_id',
          columnNames: ['permissionId'],
          referencedTableName: 'permission',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_plan_permission_planId_plan_id',
          columnNames: ['planId'],
          referencedTableName: 'plan',
          referencedColumnNames: ['id'],
        }),
      ]);

      const { identifiers: permissions } = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Permission)
        .values(permissionSeedData)
        .execute();
        
      const { identifiers: plans } = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Plan)
        .values(planSeedData)
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('plan_permission', ['planId', 'permissionId'])
        .values([
          { planId: plans[0].id, permissionId: permissions[0].id },
          { planId: plans[1].id, permissionId: permissions[1].id },
        ])
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('plan_permission');
    }
}
