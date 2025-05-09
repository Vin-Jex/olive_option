import kafka from "../config/kafka";
import { kafka_topics } from "./consts";
import { log } from "./logger";

export const producer = kafka.producer({ allowAutoTopicCreation: true });
export const kafka_admin = kafka.admin();
export const affiliate_consumer = kafka.consumer({
  groupId: "affiliate-group",
});

export const AffiliateKafkaConnect = async () => {
  await producer.connect();
  await affiliate_consumer.connect();
};

export const AffiliateSendEvent = async (
  eventType: string,
  affiliateId: number
) => {
  await producer.connect();
  await producer.send({
    topic: "user-stats",
    messages: [
      {
        value: JSON.stringify({
          eventType,
          affiliateId,
          date: new Date().toISOString().split("T")[0],
        }),
      },
    ],
  });
  await producer.disconnect();
};

(async () => {
  try {
    await producer.connect();
    await kafka_admin.connect();
    // await kafka_admin.alterConfigs({
    //   validateOnly : false,
    //   resources : [
    //     {
    //       type : ConfigResourceTypes.TOPIC,
    //       name : kafka_topics.options,
    //       configEntries : [
    //         {
    //           name : 'retention.ms',
    //           value : `${60 * 60 * 1000}`
    //         }
    //       ]
    //     }
    //   ]
    //  });
    log("info", { message: "Kafka producer and admin connected successfully" });
  } catch (err) {
    log("error", { message: "Failed to connect Kafka producer/admin", err });
    process.exit(1);
  }
})();

export const publishMessage = async (
  topic: kafka_topics | string,
  data: string,
  timestamp_?: Date
): Promise<void> => {
  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          key: new Date().getTime().toString(),
          value: data,
          timestamp: timestamp_
            ? new Date(timestamp_).getTime().toString()
            : undefined,
        },
      ],
    });
    // log("info", { message: `Message published to topic ${topic}` });
  } catch (err) {
    log("error", {
      message: `Failed to publish message to topic ${topic}`,
      err,
    });
    throw err;
  }
};

export const addConsumerToTopic = async (
  topic: kafka_topics | string,
  groupId: string,
  fromBeginning: boolean = false
): Promise<any> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning });

  // Log group join events for debugging
  consumer.on("consumer.group_join", (event) => {
    log("info", {
      message: `Consumer joined group ${groupId}`,
      event: JSON.stringify(event),
    });
  });

  return consumer;
};

export const destroyTopic = async (
  topic_name: string,
  retries = 5,
  delay = 20000
): Promise<void> => {
  try {
    await kafka_admin.deleteTopics({ topics: [topic_name], timeout: 5000 });
    log("info", { message: `Successfully deleted topic ${topic_name}` });
  } catch (err) {
    log("error", { err, message: `Failed to delete topic ${topic_name}` });
    if (retries > 0) {
      setTimeout(() => destroyTopic(topic_name, retries - 1, delay * 2), delay);
    } else {
      log("error", {
        message: `Exhausted retries to delete topic ${topic_name}`,
      });
      throw err;
    }
  }
};

// Graceful cleanup
process.on("SIGINT", async () => {
  await producer.disconnect();
  await kafka_admin.disconnect();
  process.exit(0);
});
