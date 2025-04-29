import { Request, Response } from "express";
import { ActivityLogs } from "../models/activityLogs.model";

export default class activityLogsController {
    public static async list(req: Request, res: Response) {
        try {

            const activityLogs:any = await ActivityLogs.find({});
            
            res.status(200).json({
                status: true,
                data: activityLogs,
                message: req.t("crud.list", { model: "Activity Logs"})
            })
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }

}