import { NextFunction, Request, Response, RequestHandler, ErrorRequestHandler } from "express";
import { logger } from "../providers/logger";

/**
 * 404 API redirects
 */
export const NotFoundHandler: RequestHandler = (req, res, next) => {
  logger.info(`Error 404: ${req.method} ${req.originalUrl} - Not Found`);
  if (req.headers.accept === "application/json") {
    res.status(404).json({
      status: false,
      message: "Not found",
    });
    return next();
  }
  res.render("errors/404");
  return next();
};

/**
 * 500 request error handler
 */
export const ExceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(`Error 500: ${err.stack}`);

  if (req.headers.accept === "application/json") {
    res.status(500).send({
      status: false,
      message: "Something broke!",
    });
    return;
  }
  res.render("errors/500");
  return;
};
