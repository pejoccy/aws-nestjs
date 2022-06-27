import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class AlterAccountTable1655874426806 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'account',
        new TableColumn({
          name: 'subscriptionId',
          type: 'uuid',
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
    }

}
