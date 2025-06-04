import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
} from "../../../../middleware/RequestValidator";
import { DoctorFilterRequest } from "../../../admin/doctor/requests/doctor.resquest";
import dashboardcasesController from "../controllers/dashboard.controller";
import { IdQueryParamRequest } from "../requests/id.params.request";

const router = Router();

router.get(
  "/list",
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  dashboardcasesController.dashboardSalesCasesList
);
router.get(
  "/proposal-list/:id",
  paginationCleaner,
  RequestParamsValidator(IdQueryParamRequest),
  RequestQueryValidator(DoctorFilterRequest),
  dashboardcasesController.dashboardSalesCasesProposalList
);

export default router;
