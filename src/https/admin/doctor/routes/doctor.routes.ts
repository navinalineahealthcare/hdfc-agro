import { Router } from "express";
import activityLogsController from "../controllers/doctor.controller";
import doctorController from "../controllers/doctor.controller";
import { RequestQueryValidator, RequestSortValidator } from "../../../../middleware/RequestValidator";
import { paginationCleaner } from "../../../../middleware/Pagination";
import { RoleFilterRequest } from "../../role-and-permission/requests/role.add.request";
import { DoctorFilterRequest } from "../requests/doctor.resquest";
const router = Router();

router.get(
  "/list",
  RequestSortValidator(["proposerName", "proposalNo", "premium", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(DoctorFilterRequest),
  doctorController.doctorOpencaseList
);

export default router;
