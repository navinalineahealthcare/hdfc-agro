import { Router } from "express";
import { paginationCleaner } from "../../../../middleware/Pagination";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestSortValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import doctorController from "../controllers/doctor.controller";
import {
  addRemarkRequest,
  assignParamIdRequest,
  DoctorAssignRequest,
  DoctorFilterRequest,
  submitAssignedCasesRequest,
} from "../requests/doctor.resquest";
const router = Router();

router.get(
  "/open-case-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorOpencaseList
);
router.get(
  "/assigned-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorAssigncaseList
);
router.put(
  "/close-list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorClosedCaseList
);
router.put(
  "/assign-doctor/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(DoctorAssignRequest),
  doctorController.doctorAssignCase
);
router.put(
  "/add-remark/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(addRemarkRequest),
  doctorController.addRemark
);
router.put(
  "/submit/:id",
  RequestParamsValidator(assignParamIdRequest),
  RequestValidator(submitAssignedCasesRequest),
  doctorController.submitAssignedCases
);
router.get("/list", doctorController.doctorList);

export default router;
