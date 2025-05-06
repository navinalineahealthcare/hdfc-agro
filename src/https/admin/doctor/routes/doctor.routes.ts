import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import doctorController from "../controllers/doctor.controller";
import { DoctorAssignRequest, DoctorFilterRequest } from "../requests/doctor.resquest";
const router = Router();

router.get(
  "/list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorOpencaseList
);
router.get(
  "/close-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorClosedCaseList
);
router.post(
  "/assign-doctor",
  RequestValidator(DoctorAssignRequest),
  doctorController.doctorAssignCase
);

export default router;
