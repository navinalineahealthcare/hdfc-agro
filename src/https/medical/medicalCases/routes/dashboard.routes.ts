import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestQueryValidator
} from "../../../../middleware/RequestValidator";
import {
  DoctorFilterRequest
} from "../../../admin/doctor/requests/doctor.resquest";
import dashboardcasesController from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/list",
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  dashboardcasesController.dashboardSalesCasesList
);


export default router;
