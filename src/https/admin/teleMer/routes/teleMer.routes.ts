import { Router } from "express";
import teleMerController from "../controllers/teleMer.controller";
import { RequestParamsValidator, RequestValidator } from "../../../../middleware/RequestValidator";
import { assignParamIdRequest } from "../../doctor/requests/doctor.resquest";
import { medicalQuestionValidationRequest } from "../requestes/teleMer.request";
const router = Router();

router.get(
  "/details/:id",
  RequestParamsValidator(assignParamIdRequest),
  teleMerController.teleMerlist
);
router.post(
  "/create",
  RequestValidator(medicalQuestionValidationRequest),
  teleMerController.teleMerCreated
);

export default router;
