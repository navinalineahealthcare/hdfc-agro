import { Router } from "express";
import { verifyCasesToken, verifyToken } from "../../../../middleware/Auth";
import authSalesController from "../controllers/auth.controller";
import { RequestValidator } from "../../../../middleware/RequestValidator";
import { LoginWithproposalNumRequest } from "../requests/auth.request";

const router = Router();

router.post(
  "/login",
  RequestValidator(LoginWithproposalNumRequest),
  authSalesController.loginWithProposalNum
);

router.get("/logout", verifyCasesToken, authSalesController.logout);

export default router;
