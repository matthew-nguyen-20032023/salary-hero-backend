export const AppDataSource = {
  type: process.env.DATABASE_TYPE as "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + "/../models/entities/*.entity{.ts,.js}"],
  logging: Boolean(process.env.DATABASE_LOG),
  synchronize: false,
  migrationsRun: false,
  migrations: ["dist/**/migrations/*.js"],
  migrationsTableName: "migration_history",
};
