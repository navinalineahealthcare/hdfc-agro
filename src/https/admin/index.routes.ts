import { Router } from "express";
import authRoutes from "./auth/routes/auth.routes";
import doctorRoutes from "./doctor/routes/doctor.routes";
import teleMerRoutes from "./teleMer/routes/teleMer.routes";
import roleHasPermissionRoutes from "./role-and-permission/routers/role-has-permission.router";

import { verifyToken } from "../../middleware/Auth";
import { verifypermission } from "../../middleware/PermissionValidation";
const router = Router();

router.use("/auth", authRoutes);
router.use("/doctor", verifyToken, doctorRoutes);
router.use("/tele-mer", teleMerRoutes);

router.use(
  "/role-permission",
  verifyToken,
  verifypermission,
  roleHasPermissionRoutes
);

export default router;
