import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateSubscriptionTable1655740990301 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'subscription',
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
              name: 'accountId',
              type: 'integer',
            },
            {
              name: 'paymentId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'recurring',
              type: 'boolean',
              default: true,
            },
            {
              name: 'status',
              type: 'boolean',
              default: true,
            },
            {
              name: 'isTrial',
              type: 'boolean',
              default: false,
            },
            {
              name: 'billingStartDate',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'nextBillingDate',
              type: 'timestamp',
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
        })
      );

      await queryRunner.createUniqueConstraint(
        'subscription',
        new TableUnique({
          name: 'uniq_subscription_paymentId',
          columnNames: ['paymentId'],
        })
      );

      await queryRunner.createForeignKeys('subscription', [
        new TableForeignKey({
          name: 'fk_subscription_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_subscription_planId_plan_id',
          columnNames: ['planId'],
          referencedTableName: 'plan',
          referencedColumnNames: ['id'],
        }),
      ]);

      // modify account entity
      await queryRunner.addColumn(
        'account',
        new TableColumn({
          name: 'subscriptionId',
          type: 'integer',
          isNullable: true,
        })
      );
  
      await queryRunner.createUniqueConstraint(
        'account',
        new TableUnique({
          name: 'unq_account_subscriptionId',
          columnNames: ['subscriptionId'],
        })
      );

      await queryRunner.createForeignKey('account', new TableForeignKey({
        name: 'fk_account_subscriptionId_subscription_id',
        columnNames: ['subscriptionId'],
        referencedTableName: 'subscription',
        referencedColumnNames: ['id'],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropUniqueConstraint(
        'account',
        'unq_account_subscriptionId'
      );
      await queryRunner.dropForeignKey(
        'account',
        'fk_account_subscriptionId_subscription_id'
      );
      await queryRunner.dropColumn('account', 'subscriptionId');

      await queryRunner.dropTable('subscription');
    }

}
