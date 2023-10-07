import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterBusinessBookingTable1887014708994 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'business_session_booking',
      'referredById',
      new TableColumn({
        name: 'assignedById',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.addColumns('business_session_booking', [
      new TableColumn({
        name: 'assignedToId',
        type: 'integer',
        isNullable: true,
      }),
      new TableColumn({
        name: 'businessBranchId',
        type: 'integer',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('business_session_booking', [
      new TableForeignKey({
        name: 'fk_bsb_assignedToId_specialist_id',
        columnNames: ['assignedToId'],
        referencedTableName: 'specialist',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_bsb_assignedById_account_id',
        columnNames: ['assignedById'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'business_session_booking',
      'fk_bsb_assignedById_account_id',
    );
    await queryRunner.changeColumn(
      'business_session_booking',
      'assignedById',
      new TableColumn({
        name: 'referredById',
        type: 'integer',
        isNullable: true,
      }),
    );
    await queryRunner.dropForeignKey(
      'business_session_booking',
      'fk_bsb_assignedToId_specialist_id'
    );
    await queryRunner.dropColumns('business_session_booking', [
      'assignedToId',
      'businessBranchId',
    ]);
  }
}
