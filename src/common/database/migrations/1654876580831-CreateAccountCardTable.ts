import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAccountCardTable1654876580831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_card',
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
            isNullable: true,
          },
          {
            name: 'pan',
            type: 'varchar',
          },
          {
            name: 'expiryMonth',
            type: 'integer',
          },
          {
            name: 'expiryYear',
            type: 'integer',
          },
          {
            name: 'currency',
            type: 'varchar',
          },
          {
            name: 'paymentToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'encrypted',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'disabled'],
            default: `'${'active'}'`,
          },
          {
            name: 'accountId',
            type: 'integer',
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

    await queryRunner.createForeignKey(
      'account_card',
      new TableForeignKey({
        name: 'fk_account_card_accountId_account_id',
        columnNames: ['accountId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_card');
  }
}
