import * as dotenv from "dotenv";
import { getOsEnv, normalizePort, toNumber } from "./env/index";
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  node: process.env.APP_ENV || "development",
  isProduction: process.env.APP_ENV === "production",
  isTest: process.env.APP_ENV === "test",
  isDevelopment: process.env.APP_ENV === "development",
  app: {
    database_url: getOsEnv("DATABASE_URL"),
    api_prefix: getOsEnv("API_PREFIX"),
    name: getOsEnv("APP_NAME"),
    api_rate_limit: toNumber("API_RATE_LIMIT"),
    host: getOsEnv("APP_URL"),
    port: normalizePort(process.env.PORT || getOsEnv("APP_PORT")),
    pagination_limit: toNumber(getOsEnv("PAGINATION_LIMIT")),
    root_dir: getOsEnv("APP_ENV") === "production" ? "dist" : "src",
  },
  auth: {
    secret: getOsEnv("JWT_SECRET")!,
    expiresIn: getOsEnv("JWT_EXPIRES_IN"),
    forgotPasswordExpiredIn: getOsEnv("JWT_FORGOT_PASSWORD_EXPIRES_IN"),
    deviceExpireIn: getOsEnv("DEVICE_EXPIRY_HRS")
  },
  jwtsecret: getOsEnv("JWTSECRET"),
  cors: {
    urls: getOsEnv("CORS_AVAILABLE_LINKS").split(","),
  },
  mail: {
    host: getOsEnv("MAIL_HOST"),
    port: toNumber(getOsEnv("MAIL_PORT")),
    username: getOsEnv("MAIL_USERNAME"),
    password: getOsEnv("MAIL_PASSWORD"),
    enc: getOsEnv("MAIL_ENCRYPTION"),
    from_address: getOsEnv("MAIL_FROM_ADDRESS"),
    name: getOsEnv("MAIL_FROM_NAME"),
    // send_grid_api_key: getOsEnv("SEND_GRID_MAIL_API_KEY")
  },
  // twilio: {
  //   auth_token: getOsEnv("TWILIO_AUTH_TOKEN"),
  //   account_sid: getOsEnv("TWILIO_ACCOUNT_SID")

  // },
  aws: {
    accessKey: getOsEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getOsEnv("AWS_SECRET_ACCESS_KEY"),
    bucket: getOsEnv("AWS_BUCKET"),
    region: getOsEnv("AWS_DEFAULT_REGION"),
    endpoint: getOsEnv("AWS_ENDPOINT"),
  },

};
export { toNumber };

