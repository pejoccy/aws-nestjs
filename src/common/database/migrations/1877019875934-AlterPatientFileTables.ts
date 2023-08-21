import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterPatientFileTables1877019875934 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'file',
      new TableColumn({
        name: 'tags',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumns('patient', [
      new TableColumn({
        name: 'weight',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'height',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'stateId',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'businessId',
        type: 'integer',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('patient', [
      new TableForeignKey({
        name: 'fk_patient_stateId_state_id',
        columnNames: ['stateId'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_patient_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('patient', 'fk_patient_stateId_state_id');
    await queryRunner.dropForeignKey(
      'patient',
      'fk_patient_businessId_business_id',
    );
    await queryRunner.dropColumns('patient', [
      'businessId',
      'stateId',
      'weight',
      'height',
      'city',
    ]);
    await queryRunner.dropColumn('file', 'tags');
  }
}
