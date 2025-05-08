import { Router } from "express";
import pingRoutes from "../https/ping/routes/ping.routes";

import countryStateCityRouter from "../https/country-state-city/routes/country-state-city.routes";

import adminRoutes from "../https/admin/index.routes";
import UploadRouter from "../https/upload/routes/upload.routes";
import HDFCCasesRouter from "../https/common/hdfcCases/routes/hdfcCases.routes";
import CommonAPIRouter from "../https/common/commanAPI/routes/disposition.routes";
import smartFloAPIRouter from "../https/common/commanAPI/routes/callSmartFlo.routes";
import medicalQuestionAPIRouter from "../https/common/commanAPI/routes/medicalQuestion.routes";

const router = Router();

router.use("/", pingRoutes);

router.use("/admin", adminRoutes);
router.use("/country-state-city", countryStateCityRouter);
router.use("/upload", UploadRouter);
router.use("/data", HDFCCasesRouter);
router.use("/hdfc-egro", CommonAPIRouter);
router.use("/smartflo", smartFloAPIRouter);
router.use("/mer", medicalQuestionAPIRouter);

export default router;
