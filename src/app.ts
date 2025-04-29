import { Express } from "./providers/express";
import { Locale } from "./providers/locale";
import { logger } from "./providers/logger";
import { Server } from "./providers/server";

import { env } from "./env";
import { cron } from "./providers/cron";

const locale = new Locale();
const { middleware, i18next } = locale.initializeLocales();
const express = new Express();

Promise.all([
  express.initializeApp(),

  // express.configureRateLimiter(),
  express.configureLocale(middleware, i18next),
  express.configureViews(),
  express.configureExceptionHandler(),
]).then(() => {
  const app = express.app;
  const httpServer = new Server(app);
  // ioConnection(httpServer.server);

  httpServer.start();
  if (env.node === "development" || env.node === "production") {
    cron.setup();
  }
});

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.debug("SIGTERM signal received: closing HTTP server");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});
