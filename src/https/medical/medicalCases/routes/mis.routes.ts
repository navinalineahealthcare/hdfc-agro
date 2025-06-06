import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
} from "../../../../middleware/RequestValidator";
import { DoctorFilterRequest } from "../../../admin/doctor/requests/doctor.resquest";
import dashboardMedicalController from "../controllers/dashboard.controller";
import { IdQueryParamRequest } from "../requests/id.params.request";
import medicalReportController from "../controllers/report.controller";
import misCasesController from "../controllers/mis.controller";

const router = Router();

router.get(
  "/export",
  RequestQueryValidator(DoctorFilterRequest),
  misCasesController.misCasesExport
);


export default router;
