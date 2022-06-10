import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm'

export class CreateUserTable1654838678516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
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
              name: 'firstName',
              type: 'varchar',
            },
            {
              name: 'lastName',
              type: 'varchar',
            },
            {
              name: 'phoneNumber',
              type: 'varchar',
            },
            {
              name: 'profilePhoto',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'isPrimaryUser',
              type: 'boolean',
              default: false,
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
              enum: ['patient', 'specialist', 'business_contact'],
            },
            {
              name: 'businessId',
              type: 'uuid',
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
        })
      );

      await queryRunner.createUniqueConstraint(
        'user',
        new TableUnique({
          name: 'uniq_user_email',
          columnNames: ['email'],
        })
      );

      await queryRunner.createForeignKey('user', new TableForeignKey({
        name: 'fk_user_businessId_business_id',
        columnNames: ['businessId'],
        referencedTableName: 'business',
        referencedColumnNames: ['id'],
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('user');
    }

}
