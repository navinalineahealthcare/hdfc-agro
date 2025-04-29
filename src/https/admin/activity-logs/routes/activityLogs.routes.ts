import { Router } from "express";
import activityLogsController from "../controllers/activityLogs.controller";
const router = Router();

router.get(
    "/list",
    activityLogsController.list
)

export default router;