import { Router } from "express";
import { hdfcDumpCasesController } from "../controller/hdfcCases.controller";

const router = Router();

router.post("/dump-hdfc-cases", hdfcDumpCasesController.dumpHDFCCases);

export default router;
