import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateReportTable1655995677137 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'report',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'folderId',
              type: 'uuid',
            },
            {
              name: 'details',
              type: 'jsonb',
              isNullable: true,
              comment: `'[{"caption": "Clinical information", "description": "Here goes the description.", "sortOrder": 1}]'`,
            },
            {
              name: 'createdBy',
              type: 'uuid',
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
        'report',
        new TableUnique({
          name: 'uniq_report_folderId',
          columnNames: ['folderId'],
        })
      );

      await queryRunner.createForeignKeys('report', [
        new TableForeignKey({
          name: 'fk_report_folderId_folder_id',
          columnNames: ['folderId'],
          referencedTableName: 'folder',
          referencedColumnNames: ['id'],
        }),
        new TableForeignKey({
          name: 'fk_report_createdBy_account_id',
          columnNames: ['createdBy'],
          referencedTableName: 'account',
          referencedColumnNames: ['id'],
        }),
      ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('report');
    }
}
