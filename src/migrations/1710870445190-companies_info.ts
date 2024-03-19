import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class companiesInfo1710870445190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "companies_info",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            comment:
              "Partner must update their company info to register their worker!",
          },
          {
            name: "user_id",
            type: "int",
            isNullable: false,
            comment: "Each company info will belong to one user",
          },
          {
            name: "company_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "company_description",
            type: "varchar",
            length: "500",
            isNullable: true,
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
