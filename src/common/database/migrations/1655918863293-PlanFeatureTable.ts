import _ from 'lodash';
import { PlanFeature } from '../../plan/plan-feature/plan-feature.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';
import { Feature } from '../../feature/feature.entity';
import { Plan } from '../../plan/plan.entity';
import { featureSeedData } from '../seeders/features';
import { planSeedData } from '../seeders/plans';

const planFeatureSeedData = planSeedData.reduce(
  (acc, { features, id: planId }) => {
    for (const [accountType, feature] of Object.entries(features)) {
      for (const [slug, limit] of Object.entries(feature)) {
        console.log(featureSeedData, { [slug]: limit });
        const featureId = featureSeedData.find((feat) => feat.slug === slug);
        console.log({ featureId });
        acc.push({
          planId,
          featureId: featureId.id,
          accountType,
          limit,
        });
      }
    }
    return acc;
  },
  [],
);

export class PlanFeatureTable1655918863293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plan_feature',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'planId',
            type: 'integer',
          },
          {
            name: 'featureId',
            type: 'integer',
          },
          {
            name: 'accountType',
            type: 'varchar',
          },
          {
            name: 'limit',
            type: 'varchar',
            isNullable: true,
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
      }),
    );

    await queryRunner.createUniqueConstraint(
      'plan_feature',
      new TableUnique({
        name: 'uniq_plan_feature_planId_featureId_accountType',
        columnNames: ['planId', 'featureId', 'accountType'],
      }),
    );

    await queryRunner.createForeignKeys('plan_feature', [
      new TableForeignKey({
        name: 'fk_plan_feature_featureId_feature_id',
        columnNames: ['featureId'],
        referencedTableName: 'feature',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_plan_feature_planId_plan_id',
        columnNames: ['planId'],
        referencedTableName: 'plan',
        referencedColumnNames: ['id'],
      }),
    ]);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Feature)
      .values(featureSeedData)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values(planSeedData.map(({ features: _, ...plan }) => plan))
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PlanFeature)
      .values(planFeatureSeedData)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plan_feature');
  }
}
