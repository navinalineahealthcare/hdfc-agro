import { Request, Response } from "express";

export default class doctorController {

  public static async doctorList(req: Request, res: Response) {
    try {
      const doctorList: any[] = [];

      res.status(200).json({
        status: true,
        data: doctorList,
        message: req.t("crud.list", { model: "Activity Logs" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

}
