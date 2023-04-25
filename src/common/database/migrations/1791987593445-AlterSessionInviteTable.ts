import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterSessionInviteTable1791987593445
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'session_invite',
      new TableColumn({
        name: 'invitedBy',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'session_invite',
      new TableForeignKey({
        name: 'fk_session_invite_invitedBy_account_id',
        columnNames: ['invitedBy'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'session_invite',
      'fk_session_invite_invitedBy_account_id',
    );
    await queryRunner.dropColumn('session_invite', 'invitedBy');
  }
}
