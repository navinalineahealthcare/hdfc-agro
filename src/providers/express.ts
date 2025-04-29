import express, { Application, Request, Response } from "express";
import "express-async-errors";
import helmet from "helmet";
import cookieSession from "cookie-session";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { env } from "../env";
import {
  ExceptionHandler,
  NotFoundHandler,
} from "../middleware/ExceptionHandler";
import apiRouter from "../routes/api.routes";
import { connection } from "./db";

export class Express {
  app: Application;

  constructor() {
    this.app = express();
  }

  initializeApp = () => {
    const port = process.env.APP_PORT;
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
      })
    );
    this.app.set("view engine", "hbs");
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true, limit: "30mb" }));
    this.app.use(express.static("upload"));
    this.app.use(helmet());
    this.app.disable("x-powered-by");
    this.app.use("/contents", express.static("src/storage/uploads"));

    // error handler
    this.app.set("port", port);
    this.app.use(
      cookieSession({
        name: "session",
        keys: ["alineahealth"],
        maxAge: 24 * 60 * 60 * 100,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    connection();
  };

  configureViews = () => {
    this.app.set("view engine", "hbs");
    this.app.set("views", env.app.root_dir + "/views/");
    this.app.use(`/${env.app.api_prefix}`, apiRouter);

    this.app.get("*", function (req: Request, res: Response) {
      res.send("<h1>Welcome to alineahealth Server</h1>");
    });
  };
  configureLocale = (middleware: any, i18next: any) => {
    this.app.use(middleware.handle(i18next));
  };

  configureRateLimiter = async () => {
    if (env.app.api_rate_limit > 0) {
      this.app.use(
        rateLimit({
          skip: (request: Request) => {
            const urlArray = request.originalUrl.split("/");
            if (
              urlArray.length > 2 &&
              urlArray[1] === "queues" &&
              urlArray[2] === "api"
            ) {
              return true;
            }
            return false;
          },
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: env.app.api_rate_limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
          standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
          legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        })
      );
    }
  };

  configureExceptionHandler = () => {
    this.app.use(NotFoundHandler);
    this.app.use(ExceptionHandler);
  };
}
