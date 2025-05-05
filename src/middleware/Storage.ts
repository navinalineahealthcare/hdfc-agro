import multer, { MulterError, StorageEngine } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { Request, Response, NextFunction } from "express";
import { env } from "../env";
import { logger } from "../providers/logger";
import { getMonthName, sanitizedFileName } from "../utils/utils";
import responseWrapper from "../constants/responseWrapper";
import { COMMON_MESSAGE } from "../constants/constants";
export interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Initialize S3 Client
const s3: S3Client = new S3Client({
  credentials: {
    accessKeyId: env.aws.accessKey,
    secretAccessKey: env.aws.secretAccessKey,
  },
  region: env.aws.region,
});

// S3 storage engine
const s3Storage = (destination: string): StorageEngine => {
  return multerS3({
    s3,
    bucket: env.aws.bucket,
    key: (req: Request, file: Express.Multer.File, cb) => {
      const sanitized = sanitizedFileName(file.originalname);
      const modifiedName = `${destination}${Date.now()}-${sanitized}`;
      cb(null, modifiedName);
    },
  });
};

// Upload middleware
const upload = (destination: string): multer.Multer => {
  console.log(destination, "-----------------");
  return multer({
    storage: s3Storage(destination),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  });
};

// Upload handler middleware
const s3Upload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { requestId } = req.query;
    const today = new Date();
    const destination = requestId
      ? `OptumDev/${today.getFullYear()}/${getMonthName()}/egro/${requestId}/`
      : `OptumDev/${today.getFullYear()}/${getMonthName()}/egro`;

    console.log(destination, "-----------------");

    upload(destination).single("file")(req, res, (err: any) => {
      if (err) {
      
        const result = responseWrapper(false, COMMON_MESSAGE.Error, 500, {
          success: false,
          message: COMMON_MESSAGE.Error,
        });
  

        if (err instanceof MulterError) {
          logger.error("Multer Error: " + err.message, {
            data: err,
            log: "error",
          });
          res
            .status(200)
            .json({ ...result, data: { msg: `Multer Error: ${err.message}` } });
        } else {
          logger.error("S3 Upload Error: " + err?.message, {
            data: err,
            log: "error",
          });
          res.status(200).json({
            ...result,
            data: { msg: `S3 Upload Error: ${err.message}` },
          });
        }
        return;
      }
      next();
    });
  } catch (error) {
    console.log(error, "--------------");
    throw error;
  }
};

export const s3Client = s3;
export default s3Upload;
export { upload, s3Storage };
export type { S3Client };
