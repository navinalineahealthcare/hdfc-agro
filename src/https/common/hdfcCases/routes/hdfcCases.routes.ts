import { Router } from "express";
import { hdfcDumpCasesController } from "../controller/hdfcCases.controller";
import { RequestValidator } from "../../../../middleware/RequestValidator";
import { hdfcDumpCasesRequest } from "../requests/hdfcCases.request";

const router = Router();

router.post(
  "/dump-hdfc-cases",
  RequestValidator(hdfcDumpCasesRequest),
  hdfcDumpCasesController.dumpHDFCCases
);

export default router;
