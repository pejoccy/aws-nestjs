import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateBusinessTable1654771570421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'business',
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
            },
            {
              name: 'category',
              type: 'varchar',
              comment: 'e.g. hospital, clinic, laboratory, radiology/diagnostics center'
            },
            {
              name: 'country',
              type: 'varchar',
              comment: 'Country iso-2 code, e.g. NG'
            },
            {
              name: 'website',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'logoId',
              type: 'integer',
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
        'business',
        new TableUnique({
          name: 'uniq_business_name',
          columnNames: ['name'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('business');
    }

}
