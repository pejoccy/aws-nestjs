import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';
import { Specialization } from '../../specialization/specialization.entity';
import { specializationSeedData } from '../seeders/specialization';

export class CreateSpecializationTable1654876580875
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'specialization',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
            comment: 'e.g. ',
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

    await queryRunner.createUniqueConstraints('specialization', [
      new TableUnique({
        name: 'uniq_specialization_code',
        columnNames: ['code'],
      }),
      new TableUnique({
        name: 'uniq_specialization_title',
        columnNames: ['title'],
      }),
    ]);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Specialization)
      .values(specializationSeedData)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('specialization');
  }
}
