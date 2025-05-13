import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import qcDoctorController from "../controllers/qcDoctor.controller";
import {
  assignParamIdRequest,
  DoctorAssignRequest,
  DoctorFilterRequest,
  submitAssignedCasesRequest
} from "../requests/doctor.resquest";
const router = Router();

router.get(
  "/open-case-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  qcDoctorController.qcDoctorOpencaseList
);
router.get(
  "/assigned-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  qcDoctorController.qcDoctorAssigncaseList
);

router.put(
  "/assign-doctor/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(DoctorAssignRequest),
  qcDoctorController.qcDoctorAssignCase
);

router.put(
  "/approve/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(submitAssignedCasesRequest),
  qcDoctorController.approvedQCCases
);
router.put(
  "/reject/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(submitAssignedCasesRequest),
  qcDoctorController.rejectQCCases
);
router.get("/list", qcDoctorController.qcDoctorList);

export default router;
