import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class workerWallet1711008548306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "worker_wallet",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "worker_email",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "available_balance",
            type: "int",
            default: 0,
            comment: "available balance so that worker can withdraw",
          },
          {
            name: "pending_balance",
            type: "int",
            default: 0,
            comment:
              "Pending balance so that worker need to wait until next day to available. This is used when company want to update again yesterday worker salary",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
            comment: "Used when want to block worker wallet",
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
