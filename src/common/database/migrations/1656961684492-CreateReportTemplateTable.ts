import { MigrationInterface, QueryRunner, Table, TableColumn, TableUnique } from "typeorm";
import { ReportTemplate } from "../../../pacs/report-template/report-template.entity";
import { reportTemplateSeedData } from "../seeders/report-templates";

export class CreateReportTemplateTable1656861684492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'report_template',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
            },
            {
              name: 'modality',
              type: 'varchar',
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'controls',
              type: 'jsonb',
              comment: 'e.g. IReportTemplateControl[]',
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
        'report_template',
        new TableUnique({
          name: 'uniq_report_template_modality',
          columnNames: ['modality'],
        })
      );

       // modify account entity
       await queryRunner.addColumn(
        'session',
        new TableColumn({
          name: 'reportTemplateId',
          type: 'integer',
          isNullable: true,
        })
      );
  

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ReportTemplate)
        .values(reportTemplateSeedData)
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('report_template');
      await queryRunner.dropColumn('session', 'reportTemplateId');
    }
}
