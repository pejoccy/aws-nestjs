import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGenderFields1769593413420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'business_contact',
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '10',
        isNullable: true,
        comment: 'e.g. male, female, others',
      }),
    );

    await queryRunner.addColumn(
      'specialist',
      new TableColumn({
        name: 'gender',
        type: 'varchar',
        length: '10',
        isNullable: true,
        comment: 'e.g. male, female, others',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('business_contact', 'gender');
    await queryRunner.dropColumn('specialist', 'gender');
  }
}
