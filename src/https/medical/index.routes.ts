import { Router } from "express";
import appointmentRoutes from "./medicalCases/routes/dashboard.routes";
import reportRoutes from "./medicalCases/routes/report.routes";

import { verifyToken } from "../../middleware/Auth";
const router = Router();

router.use("/cases", verifyToken, appointmentRoutes);
router.use("/report", verifyToken, reportRoutes);

export default router;
