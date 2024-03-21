import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class jobs1711014723466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "jobs",
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
              "Date in timestamp UTC +0, hours, minute and second will be set to 0",
          },
          {
            name: "key",
            type: "varchar",
            length: "255",
            isNullable: false,
            comment: "Job key, can be any value as we want",
          },
          {
            name: "job_type",
            type: "varchar",
            length: "255",
            isNullable: false,
            comment:
              "Job type, can be calculate_worker_salary, init_job_calculate_worker_salary",
          },
          {
            name: "status",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
          {
            name: "note",
            type: "varchar",
            length: "255",
            isNullable: true,
            comment: "Some note if worker want to",
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
