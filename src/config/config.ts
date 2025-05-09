import * as Joi from "joi";
import validator from "../utils/validator";

const env = () => {
  const schema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid("development", "staging", "production")
      .required(),
    PORT: Joi.number().required(),

    DB_CONNECTION_STRING: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    SECRET_KEY: Joi.string().required(),
    HASH_SALT: Joi.string().required(),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.string().required(),
    SMTP_PORT_LOCAL: Joi.string().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SMTP_SENDER: Joi.string().required(),
    SMTP_SENDER_NAME: Joi.string().required(),

    ACCESS_TOKEN_EXPIRE_MIN: Joi.string().required(),
    REFRESH_TOKEN_EXPIRE_HOUR: Joi.string().required(),

    URL_OF_APPLICATION: Joi.string().required(),
    SERVER_URL: Joi.string().required(),

    AZURE_STORAGE_NAME: Joi.string().required(),
    AZURE_CONTAINER_NAME: Joi.string().required(),
    AZURE_STORAGE_KEY: Joi.string().required(),

    KAFKA_BROKER_URL: Joi.string().required(),

    POLYGON_BASEURL: Joi.string().required(),
    POLYGON_SOCKET: Joi.string().required(),
    POLYGON_API_KEY: Joi.string().required(),

    TELEGRAM_BOT_TOKEN: Joi.string().required(),

    NOWPAY_BASEURL: Joi.string().required(),
    NOWPAY_EMAIL: Joi.string().required(),
    NOWPAY_PASSWORD: Joi.string().required(),
    NOWPAY_NOTIFICATION_KEY: Joi.string().required(),
    NOWPAY_API_KEY: Joi.string().required(),
    NOWPAY_WEBHOOK: Joi.string().required(),

    // Sumsub configs
    SUMSUB_ENABLED: Joi.string().required(),
    SUMSUB_APP_SECRET: Joi.string().allow("").required(),
    SUMSUB_APP_TOKEN: Joi.string().allow("").required(),
    SUMSUB_BASE_URL: Joi.string().required(),

    BOT_URL: Joi.string().allow("").optional(),

    // KAFKA_ADVERTISED_LISTENERS: Joi.string().optional(),
    // KAFKA_CONTROLLER_LISTENER_NAMES: Joi.string().optional(),
    // KAFKA_CONTROLLER_QUORUM_VOTERS: Joi.string().optional(),
    // KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: Joi.string().optional(),
    // KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: Joi.string().optional(),
    // KAFKA_LISTENERS: Joi.string().optional(),
    // KAFKA_NODE_ID: Joi.string().optional(),
    // KAFKA_NUM_PARTITIONS: Joi.string().optional(),
    // KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: Joi.string().optional(),
    // KAFKA_PROCESS_ROLES: Joi.string().optional(),
    // KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: Joi.string().optional(),
    // KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: Joi.string().optional(),
  }).unknown(true);

  return validator(schema, process.env);
};

export default env();
