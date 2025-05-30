import { Router } from "express";
import teleMerController from "../controllers/teleMer.controller";
import {
  RequestParamsValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { assignParamIdRequest } from "../../doctor/requests/doctor.resquest";
import { medicalQuestionValidationRequest } from "../requestes/teleMer.request";
const router = Router();

router.get(
  "/details/:id",
  RequestParamsValidator(assignParamIdRequest),
  teleMerController.teleMerlist
);
router.put(
  "/unlink/:id",
  RequestParamsValidator(assignParamIdRequest),
  teleMerController.teleMerUnlink
);
router.post(
  "/create",
  RequestValidator(medicalQuestionValidationRequest),
  teleMerController.teleMerCreated
);

router.get(
  "/pdf-convert/:id",
  RequestParamsValidator(assignParamIdRequest),
  (req, res, next) => {
    Promise.resolve(teleMerController.teleMerPdfConvert(req, res)).catch(next);
  }
);

export default router;
