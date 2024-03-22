import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class workerWalletHistories1711009720195 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "worker_wallet_histories",
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
              "Date of action but in timestamp for multiple region support",
          },
          {
            name: "worker_email",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "action_type",
            type: "varchar",
            length: "10",
            isNullable: false,
            comment: "Can be withdraw, transfer, receive,...",
          },
          {
            name: "amount",
            type: "int",
            default: 0,
            comment: "amount of money",
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
    await queryRunner.createIndices("worker_wallet_histories", [
      new TableIndex({
        columnNames: ["worker_email", "date"],
        isUnique: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
