import * as dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "testing" ? ".env.test" : ".env",
});
import { Kafka } from "kafkajs";

export const KafkaConfig = new Kafka({
  clientId: process.env.APP_NAME,
  brokers: [
    `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`, // for multiple kafka cluster
  ],
});

// For specific kafka topic to another develop to know
export enum KafkaTopic {
  CalculateDailyWorkerSalary = "calculate-daily-worker-salary",
}
