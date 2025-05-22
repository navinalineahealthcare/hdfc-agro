import { Router } from "express";
import authRoutes from "./auth/routes/auth.routes";
import doctorRoutes from "./doctor/routes/doctor.routes";
import qcDoctorRoutes from "./doctor/routes/qcDoctor.routes";
import teleMerRoutes from "./teleMer/routes/teleMer.routes";
import roleHasPermissionRoutes from "./role-and-permission/routers/role-has-permission.router";

import { verifyToken } from "../../middleware/Auth";
import { verifypermission } from "../../middleware/PermissionValidation";
import qcTeleMerRoutes from "./teleMer/routes/qcTeleMer.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/doctor", verifyToken, doctorRoutes);
router.use("/qc", verifyToken, qcDoctorRoutes);
router.use("/tele-mer", teleMerRoutes);
router.use("/tele-mer-qc", qcTeleMerRoutes);

router.use(
  "/role-permission",
  verifyToken,
  verifypermission,
  roleHasPermissionRoutes
);

export default router;
