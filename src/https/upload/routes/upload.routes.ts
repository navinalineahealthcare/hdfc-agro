import { Router } from "express";

import { verifyToken } from "../../../middleware/Auth";
import { RequestQueryValidator } from "../../../middleware/RequestValidator";
import s3Upload from "../../../middleware/Storage";
import { UploadController } from "../controllers/upload.controller";
import { UploadKeyQueryRequest } from "../requests/upload.request";

const router = Router();

router.post("/", verifyToken, s3Upload, UploadController.s3FileUploadService);

router.get(
  "/media",
  verifyToken,
  RequestQueryValidator(UploadKeyQueryRequest),
  UploadController.accessS3UploadsService
);

export default router;
