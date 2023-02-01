import { Account } from '../../../account/account.entity';
import { Specialist } from '../../../account/specialist/specialist.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableUnique,
} from 'typeorm';
import { anonymousAccountSeedData } from '../seeders/anonymous-user-data';
import { Specialization } from 'src/common/specialization/specialization.entity';

export class CreateSessionInviteTable1669956459341
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session_invite',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'inviteeEmail',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'accountId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'sessionId',
            type: 'integer',
          },
          {
            name: 'permission',
            type: 'varchar',
            default: `'read-write'`,
            comment: 'e.g. read-write, readonly',
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'pending'`,
            comment: 'e.g. pending, accepted, declined, cancelled',
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
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
    );

    await queryRunner.createUniqueConstraints('session_invite', [
      new TableUnique({
        name: 'uniq_session_invite_sessionId_accountId',
        columnNames: ['sessionId', 'accountId'],
      }),
      new TableUnique({
        name: 'uniq_session_invite_sessionId_inviteeEmail',
        columnNames: ['sessionId', 'inviteeEmail'],
      }),
      new TableUnique({
        name: 'uniq_session_invite_sessionId_token',
        columnNames: ['sessionId', 'token'],
      }),
    ]);

    await queryRunner.createForeignKeys('session_invite', [
      new TableForeignKey({
        name: 'fk_session_invite_accountId_account_id',
        columnNames: ['accountId'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        name: 'fk_session_invite_sessionId_session_id',
        columnNames: ['sessionId'],
        referencedTableName: 'session',
        referencedColumnNames: ['id'],
      }),
    ]);

    // modify session-collaborator entity
    await queryRunner.addColumn(
      'session_collaborator',
      new TableColumn({
        name: 'expiresAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'account',
      new TableColumn({
        name: 'isAnonymous',
        type: 'boolean',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'specialization',
      new TableColumn({
        name: 'isAnonymous',
        type: 'boolean',
        default: false,
      }),
    );

    // create anonymous collaborate account
    const {
      raw: [{ id }],
    } = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Account)
      .values([anonymousAccountSeedData.account])
      .execute();

    const {
      raw: [{ id: specializationId }],
    } = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Specialization)
      .values([anonymousAccountSeedData.specialization])
      .execute();

    // create anonymous collaborate account
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Specialist)
      .values([
        {
          ...anonymousAccountSeedData.specialist,
          accountId: id,
          specializationId,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('session_invite');
    // delete anonymous account/specialist
    const { id } = await queryRunner.manager.findOneOrFail(Account, {
      where: { isAnonymous: true },
    });
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Specialist)
      .where({ accountId: id })
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Specialization)
      .where({ isAnonymous: true })
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Account)
      .where({ isAnonymous: true })
      .execute();
    // drop expiresAt column on session_collaborator
    await queryRunner.dropColumn('session_collaborator', 'expiresAt');
    await queryRunner.dropColumn('account', 'isAnonymous');
    await queryRunner.dropColumn('specialization', 'isAnonymous');
  }
}
