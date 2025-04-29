import { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  RequestParamsValidator,
  RequestValidator,
} from "../../../../middleware/RequestValidator";
import { LoginRequest } from "../requests/login.request";
import { verifyResetToken, verifyToken } from "../../../../middleware/Auth";
import { ForgotPasswordRequest } from "../requests/forgotPassword.request";
import { ResetPasswordRequest } from "../requests/resetPassword.request";
import { ProfileUpdateRequest } from "../requests/update.profile.request";
import { IdQueryParamRequest } from "../requests/id.params.request";
import { SetNotificationTokenRequest } from "../requests/setNotificationToken.request";

const router = Router();

router.post("/login", RequestValidator(LoginRequest), authController.login);

router.post(
  "/forgot-password",
  RequestValidator(ForgotPasswordRequest),
  authController.forgot
);

router.get("/reset-password", verifyResetToken, authController.checkResetToken);

router.post(
  "/reset-password",
  RequestValidator(ResetPasswordRequest),
  verifyResetToken,
  authController.resetPassword
);

router.get("/profile", verifyToken, authController.getProfile);

router.put(
  "/profile/:id",
  verifyToken,
  RequestParamsValidator(IdQueryParamRequest),
  RequestValidator(ProfileUpdateRequest),
  authController.profileUpdate
);
router.put(
  "/change-password",
  verifyToken,
  RequestValidator(ResetPasswordRequest),
  authController.resetPasswordAdmin
)
router.get("/logout", verifyToken, authController.logout);

router.get("/permission-list", verifyToken, authController.permissionList);

router.get(
  "/role-list",
  verifyToken,
  authController.RoleList
)

router.put(
  "/set-notification-token",
  verifyToken,
  RequestValidator(SetNotificationTokenRequest),
  authController.setNotificationToken
)

export default router;
