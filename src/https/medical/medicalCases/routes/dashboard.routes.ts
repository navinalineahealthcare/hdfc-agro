import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
} from "../../../../middleware/RequestValidator";
import { DoctorFilterRequest } from "../../../admin/doctor/requests/doctor.resquest";
import dashboardMedicalController from "../controllers/dashboard.controller";
import { IdQueryParamRequest } from "../requests/id.params.request";

const router = Router();

router.get(
  "/list",
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  dashboardMedicalController.dashboardMedicalCasesList
);
router.get(
  "/proposal-list/:id",
  paginationCleaner,
  RequestParamsValidator(IdQueryParamRequest),
  RequestQueryValidator(DoctorFilterRequest),
  dashboardMedicalController.dashboardMedicalCasesProposalList
);
router.get(
  "/proposal-detail/:id",
  paginationCleaner,
  RequestParamsValidator(IdQueryParamRequest),
  RequestQueryValidator(DoctorFilterRequest),
  dashboardMedicalController.dashboardMedicalCasesDetails
);

export default router;
