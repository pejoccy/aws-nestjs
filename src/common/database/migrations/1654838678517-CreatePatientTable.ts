import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm'

export class CreatePatientTable1654838678517 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'patient',
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
              name: 'mobilePhone',
              type: 'varchar',
            },
            {
              name: 'gender',
              type: 'varchar',
              length: '10',
              isNullable: true,
              comment: 'e.g. male, female',
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              isNullable: true,
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
              name: 'status',
              type: 'boolean',
              default: true,
            },
            {
              name: 'accountId',
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
        }),
        true
      );

      await queryRunner.createUniqueConstraints('patient', [
        new TableUnique({
          name: 'uniq_patient_email',
          columnNames: ['email'],
        }),
        new TableUnique({
          name: 'uniq_patient_mobilePhone',
          columnNames: ['mobilePhone'],
        })
      ]);

      await queryRunner.createForeignKey('patient', new TableForeignKey({
        name: 'fk_patient_accountId_account_id',
        columnNames: ['accountId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('patient');
    }

}
