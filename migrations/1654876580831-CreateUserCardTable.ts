import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique} from "typeorm";

export class CreateUserCardTable1654876580831 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'user_card',
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
              isNullable: true
            },
            {
              name: 'encrypted',
              type: 'varchar',
              isNullable: true
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['active', 'disabled'],
              default: `'${'active'}'`,
            },
            {
              name: 'userId',
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

      await queryRunner.createForeignKey('user_card', new TableForeignKey({
        name: 'fk_user_card_userId_user_id',
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('user_card');
    }

}
