import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterBusinessBookingTable1887044799406 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'business_session_booking',
      'fk_bsb_assignedToId_specialist_id',
    );
    
    await queryRunner.createForeignKey('business_session_booking', new TableForeignKey({
      name: 'fk_bsb_assignedToId_business_contractor_id',
      columnNames: ['assignedToId'],
      referencedTableName: 'business_contractor',
      referencedColumnNames: ['id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'business_session_booking',
      'fk_bsb_assignedToId_business_contractor_id',
    );
    
    await queryRunner.createForeignKey('business_session_booking', new TableForeignKey({
      name: 'fk_bsb_assignedToId_specialist_id',
      columnNames: ['assignedToId'],
      referencedTableName: 'specialist',
      referencedColumnNames: ['id'],
    }));
  }
}
