import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableUnique,
} from 'typeorm'
import { CommsProviders } from '../../interfaces';

export class CreateAccountTable1654838678516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'account',
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
              name: 'password',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'profilePhotoId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'lastLoggedInAt',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'lastLoginIp',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'isVerified',
              type: 'boolean',
              default: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: ['active', 'disabled'],
              default: `'${'active'}'`,
            },
            {
              name: 'role',
              type: 'enum',
              enum: ['patient', 'specialist', 'business'],
            },
            {
              name: 'comms',
              type: 'jsonb',
              isNullable: true,
              comment: `${JSON.stringify({
                [CommsProviders.AWS_CHIME]: {
                  identity: 'userArn',
                },
              })}`,
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

      await queryRunner.createUniqueConstraint(
        'account',
        new TableUnique({
          name: 'uniq_account_email',
          columnNames: ['email'],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('account');
    }

}
