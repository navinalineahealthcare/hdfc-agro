import { Router } from "express";
import appointmentController from "../controllers/dashboard.controller";
import salescasesController from "../controllers/dashboard.controller";
import { verifyCasesToken } from "../../../../middleware/Auth";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
} from "../../../../middleware/RequestValidator";
import {
  assignParamIdRequest,
  DoctorFilterRequest,
} from "../../../admin/doctor/requests/doctor.resquest";

const router = Router();

router.get(
  "/list",
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  salescasesController.salescasesList
);
router.get(
  "/details/:id",
  RequestParamsValidator(assignParamIdRequest),
  appointmentController.salescasesdetails
);

export default router;
