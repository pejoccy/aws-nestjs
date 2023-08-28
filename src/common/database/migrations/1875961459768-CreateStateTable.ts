import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Country } from '../../country/country.entity';
import { State } from '../../state/state.entity';
import { statesData } from '../seeders/states';

export class CreateStateTable1875961459768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'state',
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
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'countryId',
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

    const countryNG = await queryRunner.manager
      .createQueryBuilder()
      .select()
      .from('country', 'c')
      .where({ code: 'NG' })
      .getRawOne<Country>();
    console.log('***********', countryNG);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(State)
      .values(
        statesData.map((state) => ({ countryId: countryNG.id, ...state })),
      )
      .execute();

    await queryRunner.createForeignKeys('state', [
      new TableForeignKey({
        name: 'fk_state_countryId_country_id',
        columnNames: ['countryId'],
        referencedTableName: 'country',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('state');
  }
}
