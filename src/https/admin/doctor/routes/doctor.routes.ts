import { Router } from "express";
import activityLogsController from "../controllers/doctor.controller";
import doctorController from "../controllers/doctor.controller";
const router = Router();

router.get("/list", doctorController.doctorList);

export default router;
