import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  PUBLIC_PATH: get("PUBLIC_PATH").default("public").asString(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  MYSQL_URL: get("MYSQL_URL").required().asString(),
  SEND_EMAIL: get("SEND_EMAIL").default("false").asBool(),
  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asEmailString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
  EGEMA_PROJECT_URL: get("EGEMA_PROJECT_URL").required().asString(),
  BACKBLAZE_APPLICATION_KEY: get("BACKBLAZE_APPLICATION_KEY")
    .required()
    .asString(),
  BACKBLAZE_APPLICATION_KEY_ID: get("BACKBLAZE_APPLICATION_KEY_ID")
    .required()
    .asString(),
  BACKBLAZE_BUCKET_ID: get("BACKBLAZE_BUCKET_ID").required().asString(),
  BACKBLAZE_BUCKET_NAME: get("BACKBLAZE_BUCKET_NAME").required().asString(),
};
