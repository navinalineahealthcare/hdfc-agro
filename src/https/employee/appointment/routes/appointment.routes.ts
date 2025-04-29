import { Router } from "express";
import appointmentController from "../controllers/appointment.controller";

const router = Router();

router.get("/list", appointmentController.appointmentList);
router.get("/details/:id", appointmentController.appointmentdetails);
router.put("/update/:id", appointmentController.appointmentUpdate);

export default router;
