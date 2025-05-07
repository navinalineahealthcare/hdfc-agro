import { Router } from "express";
import { dispositionController } from "../controller/disposition.controller";
import {
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { paginationCleaner } from "../../../../middleware/Pagination";
import { DoctorFilterRequest } from "../../../admin/doctor/requests/doctor.resquest";
import {
  DispositionCreateRequest,
  DispositionFilterRequest,
} from "../requests/disposition.request";
import { verifyToken } from "../../../../middleware/Auth";

const router = Router();

router.get(
  "/disposition-list",
  RequestSortValidator(["name", "createdAt"]),
  verifyToken,
  paginationCleaner,
  RequestQueryValidator(DispositionFilterRequest),
  dispositionController.dispositionList
);
router.get(
  "/disposition-create",
  verifyToken,
  RequestValidator(DispositionCreateRequest),
  dispositionController.dispositionCreate
);

export default router;
