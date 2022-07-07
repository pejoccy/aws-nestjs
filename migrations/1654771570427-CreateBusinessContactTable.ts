import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateBusinessContactTable1654771570427 implements MigrationInterface {

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
              name: 'country',
              type: 'varchar',
              comment: 'Country iso-2 code, e.g. NG'
            },
            {
              name: 'contactAddress',
              type: 'varchar',
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
        'business_contact',
        new TableUnique({
          name: 'uniq_business_contact_email',
          columnNames: ['email'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('business_contact');
    }

}
