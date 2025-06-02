import { Router } from "express";
import appointmentRoutes from "./medicalCases/routes/dashboard.routes";

import { verifyToken } from "../../middleware/Auth";
const router = Router();

router.use("/cases", verifyToken, appointmentRoutes);

export default router;
