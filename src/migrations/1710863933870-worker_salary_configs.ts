import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class workerSalaryConfigs1710863933870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "worker_salary_configs",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            comment:
              "Partner must create worker salary config for their employee, so that their salary will be calculated!",
          },
          {
            name: "company_id",
            type: "int",
            isNullable: false,
            comment: "Refer to company id on companies_info table",
          },
          {
            name: "user_email",
            type: "varchar",
            isNullable: false,
            comment: "Refer to email on users table",
          },
          {
            name: "standard_working_day",
            type: "int",
            isNullable: false,
            comment:
              "Partners (companies) can set their working days per month for specific worker instead of hard code for 30 days.",
          },
          {
            name: "base_salary",
            type: "int",
            isNullable: false,
            comment: "Partners can also set base salary for their worker",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
            isNullable: false,
            comment: "Only active config will be used to calculate salary",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
