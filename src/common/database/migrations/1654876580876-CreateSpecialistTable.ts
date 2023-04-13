import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
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
            name: 'email',
            type: 'varchar',
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
            name: 'gender',
            type: 'varchar',
            length: '10',
            isNullable: true,
            comment: 'e.g. male, female, others',
          },
          {
            name: 'mobilePhone',
            type: 'varchar',
          },
          {
            name: 'countryId',
            type: 'integer',
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
      }),
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
      new TableForeignKey({
        name: 'fk_specialist_countryId_country_id',
        columnNames: ['countryId'],
        referencedTableName: 'country',
        referencedColumnNames: ['id'],
      }),
    ]);

    await queryRunner.createUniqueConstraints('specialist', [
      new TableUnique({
        name: 'uniq_specialist_email',
        columnNames: ['email'],
      }),
      new TableUnique({
        name: 'uniq_specialist_mobilePhone',
        columnNames: ['mobilePhone'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('specialist');
  }
}
