import { Request, Response } from "express";


class appointmentController {
  public static async appointmentList(req: Request, res: Response) {
    try {
      res.json({
        status: true,
        data: [],
        message: req.t("appointment.list"),
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async appointmentUpdate(req: Request, res: Response) {
    try {
      res.json({
        status: true,
        data: [],
        message: req.t("crud.updated", { model: "Profile" }),
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async appointmentdetails(req: Request, res: Response) {
    try {
      const { userId } = req.body.auth.device;

      res.status(200).json({
        status: true,
        data: [],
        message: req.t("crud.details", { model: "appointment" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default appointmentController;
