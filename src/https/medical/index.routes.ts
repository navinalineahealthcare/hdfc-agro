import { Router } from "express";
import authRoutes from "./auth/routes/auth.routes";
import appointmentRoutes from "./medicalCases/routes/dashboard.routes";

import { verifyCasesToken, verifyToken } from "../../middleware/Auth";
const router = Router();

router.use("/auth", authRoutes);

router.use("/cases", verifyCasesToken, appointmentRoutes);

export default router;
