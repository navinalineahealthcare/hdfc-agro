import { Router } from "express";
import { UploadSingleFile } from "../../../middleware/Storage";
import { UPLOAD_TYPES } from "../../../utils/types";
import { UploadController } from "../controllers/upload.controller";

const router = Router();

router.post(
    "/",
    UploadSingleFile(UPLOAD_TYPES.IMAGE_VIDEO, 'file'),
    UploadController.uploadData
)

// router.get(
//     "/",
//     UploadController.sendNotification
// )

export default router;