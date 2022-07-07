import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSpecialistTable1654876580876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'specialist',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'firstName',
              type: 'varchar',
            },
            {
              name: 'lastName',
              type: 'varchar',
            },
            {
              name: 'mobilePhone',
              type: 'varchar',
            },
            {
              name: 'country',
              type: 'varchar',
              comment: 'Country iso-2 code, e.g. NG',
              isNullable: true,
            },
            {
              name: 'category',
              type: 'varchar',
              comment: 'e.g. specialist, under-graduate, post-graduate',
            },
            {
              name: 'specializationId',
              type: 'integer',
            },
            {
              name: 'accountId',
              type: 'integer',
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
        })
      );

      await queryRunner.createForeignKeys('specialist', [
        new TableForeignKey({
          name: 'fk_specialist_accountId_account_id',
          columnNames: ['accountId'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_specialist_specializationId_specialization_id',
          columnNames: ['specializationId'],
          referencedTableName: 'specialization',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('specialist');
    }
}
