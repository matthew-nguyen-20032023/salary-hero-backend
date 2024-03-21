import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class workerSalaryHistories1711007153515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "worker_salary_histories",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "date",
            type: "bigint",
            isNullable: false,
            comment:
              "Date of calculation but in timestamp for multiple region support",
          },
          {
            name: "worker_email",
            type: "varchar",
            length: "255",
            isNullable: false,
            comment: "Worker email",
          },
          {
            name: "daily_income",
            type: "float",
            isNullable: false,
            comment:
              "Represent for how much income worker earn in specific day",
          },
          {
            name: "total_income",
            type: "float",
            isNullable: false,
            comment:
              "Represent total income of workers from oldest til this current. Formula is today total income = yesterday total income + today daily income",
          },
          {
            name: "worker_salary_config_id",
            type: "int",
            isNullable: false,
            comment:
              "Config salary that used to calculate worker salary at this moment",
          },
          {
            name: "is_active",
            type: "boolean",
            isNullable: false,
            default: true,
            comment: "Each worker only have one active salary per day",
          },
          {
            name: "note",
            type: "varchar",
            length: "255",
            isNullable: true,
            comment:
              "Some note if we want to when we de-active and active new one. ex: new salary updated from record id 5",
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
