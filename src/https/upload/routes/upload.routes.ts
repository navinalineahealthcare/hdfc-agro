import { Router } from "express";
import { UploadSingleFile } from "../../../middleware/Storage";
import { UPLOAD_TYPES } from "../../../utils/types";
import { UploadController } from "../controllers/upload.controller";
import { RequestValidator } from "../../../middleware/RequestValidator";
import { UploadRequest } from "../requests/upload.request";

const router = Router();

router.post(
    "/",
    UploadSingleFile(UPLOAD_TYPES.IMAGE_VIDEO, 'file'),
    UploadController.uploadData
)

router.get(
    "/",
    UploadController.sendNotification
)

export default router;