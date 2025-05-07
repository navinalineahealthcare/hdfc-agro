import { Router } from "express";
import { callarSmartFloController } from "../controller/callSmartFlo.controller";
import {
  RequestParamsValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { ClickToCallRequest } from "../requests/callSmartFlo.request";
import {
  assignParamIdRequest,
  hangupCallRequest,
} from "../../../admin/doctor/requests/doctor.resquest";

const router = Router();

router.post(
  "/click-to-call/:id",
  RequestValidator(ClickToCallRequest),
  RequestParamsValidator(assignParamIdRequest),
  callarSmartFloController.clickToCall
);
router.post(
  "/hangup-call",
  RequestValidator(hangupCallRequest),
  callarSmartFloController.hangUPCallRequest
);

router.post(
  "/call-status",
  RequestValidator(hangupCallRequest),
  callarSmartFloController.callStatus
);
router.post("/call-to-webhook", callarSmartFloController.clickToCallWebhook);
router.post("/hangup-webhook", callarSmartFloController.hangUPCallWebhook);

export default router;
