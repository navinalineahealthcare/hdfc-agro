import { Router } from "express";
import authRoutes from "./auth/routes/auth.routes";
import appointmentRoutes from "./appointment/routes/appointment.routes";

import { verifyToken } from "../../middleware/Auth";
const router = Router();

router.use("/auth", authRoutes);

router.use("/appointment", verifyToken, appointmentRoutes);

export default router;
