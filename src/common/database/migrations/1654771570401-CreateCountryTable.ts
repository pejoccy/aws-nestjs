import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';
import { countriesData } from '../seeders/countries';
import { Country } from '../../country/country.entity';

export class CreateCountryTable1654771570401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'country',
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
              name: 'code',
              type: 'varchar',
              length: '2',
              comment: 'e.g. NG',
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

      await queryRunner.createIndex('country', new TableIndex({
        name: 'idx_country_name',
        columnNames: ['name'],
      }));

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Country)
        .values(countriesData)
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('country');
    }
}
