import { Router } from "express";
import teleMerController from "../controllers/teleMer.controller";
import { RequestParamsValidator } from "../../../../middleware/RequestValidator";
import { assignParamIdRequest } from "../../doctor/requests/doctor.resquest";
const router = Router();

router.get(
  "/details/:id",
  RequestParamsValidator(assignParamIdRequest),
  teleMerController.teleMerlist
);

export default router;
