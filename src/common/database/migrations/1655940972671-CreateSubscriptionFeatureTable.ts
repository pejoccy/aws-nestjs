import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateSubscriptionFeatureTable1655740990301
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscription_feature',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'subscriptionId',
            type: 'integer',
          },
          {
            name: 'featureId',
            type: 'integer',
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
      'subscription_feature',
      new TableUnique({
        name: 'uniq_subscription_feature_subscriptionId_featureId',
        columnNames: ['subscriptionId', 'featureId'],
      }),
    );

    await queryRunner.createForeignKeys('subscription_feature', [
      new TableForeignKey({
        name: 'fk_subscription_feature_subscriptionId_subscription_id',
        columnNames: ['subscriptionId'],
        referencedTableName: 'subscription',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_subscription_feature_featureId_feature_id',
        columnNames: ['featureId'],
        referencedTableName: 'feature',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscription_feature');
  }
}
