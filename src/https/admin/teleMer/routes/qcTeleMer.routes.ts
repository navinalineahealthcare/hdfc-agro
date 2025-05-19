import { Router } from "express";
import {
  RequestParamsValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { assignParamIdRequest } from "../../doctor/requests/doctor.resquest";
import { medicalQuestionValidationRequest } from "../requestes/teleMer.request";
import qcTeleMerController from "../controllers/qcTeleMer.controller";
const router = Router();

router.put(
  "/question-answer-list/:id",
  RequestParamsValidator(assignParamIdRequest),
  qcTeleMerController.qcTeleMerQuestionAnswerList
);

router.get(
  "/details/:id",
  RequestParamsValidator(assignParamIdRequest),
  qcTeleMerController.qcTeleMerList
);

router.post(
  "/confirm",
  RequestValidator(medicalQuestionValidationRequest),
  qcTeleMerController.qcTeleMerConfirm
);

export default router;
