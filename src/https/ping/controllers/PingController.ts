import { Request, Response } from "express";
import { logger } from "../../../providers/logger";

export class PingController {
  /**
   * @api {get} /ping Ping the server
   * @apiName Ping
   * @apiGroup Ping
   *
   * @apiSuccess {Boolean} status Status of the server.
   * @apiSuccess {String} message Message from the server.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": true,
   *       "message": "pong"
   *     }
   */

  public static async pong(req: Request, res: Response) {
    logger.debug("Server Pinged");
    res.json({
      status: true,
      message: "pong",
    });
  }
}
