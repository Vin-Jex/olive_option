import { Kafka } from "kafkajs";
import env from "./config";

const kafka = new Kafka({
  clientId: `oliveoption-${new Date().getTime()}`,
  brokers: [env.KAFKA_BROKER_URL],
  connectionTimeout: 5000,
  retry: {
    initialRetryTime: 1000,
    retries: 1,
  },
});

export default kafka;
