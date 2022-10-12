import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateBusinessContactTable1654838678518
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'business_contact',
        columns: [
          {
            name: 'id',
            type: 'int',
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
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'mobilePhone',
            type: 'varchar',
          },
          {
            name: 'contactAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'countryId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'accountId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'businessId',
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

    await queryRunner.createUniqueConstraint(
      'business_contact',
      new TableUnique({
        name: 'uniq_business_contact_email',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createForeignKeys('business_contact', [
      new TableForeignKey({
        name: 'fk_business_contact_accountId_account_id',
        columnNames: ['accountId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_contact_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_business_contact_countryId_country_id',
        columnNames: ['countryId'],
        referencedTableName: 'country',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('business_contact');
  }
}
