import { Request, Response } from "express";
// import { addMediaurl } from "../services/media.service";
import { UploadedFile } from "../types/upload.type";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env";
import { s3Client } from "../../../middleware/Storage";
import { Readable } from "nodemailer/lib/xoauth2";
import * as path from "path";
import responseWrapper from "../../../constants/responseWrapper";
import { COMMON_MESSAGE } from "../../../constants/constants";
import { addMediaurl } from "../services/media.service";

export class UploadController {
  public static async uploadData(req: Request, res: Response) {
    try {
      const file = req.file as UploadedFile;
      if (!file) {
        res.status(400).json({
          status: false,
          message: req.t("upload.file.notfound"),
        });
      }

      // await addMediaurl(file.path, false);

      res.status(200).json({
        status: true,
        data: {
          path: file.path,
          originalname: file.originalname,
          location: file.location,
        },
        message: req.t("upload.done"),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  public static async accessS3UploadsService(req: Request, res: Response) {
    try {
      const key = req.query?.file as string;

      const command = new GetObjectCommand({
        Bucket: env.aws.bucket,
        Key: key,
      });
      const data = await s3Client.send(command);
      if (data.Body instanceof Readable) {
        const ext = path.extname(key).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".pdf") {
          contentType = "application/pdf";
        } else if (ext === ".jpg" || ext === ".jpeg") {
          contentType = "image/jpeg";
        } else if (ext === ".png") {
          contentType = "image/png";
        }
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `inline; filename="${key}"`);
        data.Body.pipe(res);
      } else throw new Error("Unable to retrieve image from S3");
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        res.status(404).send("Error: File not found");
      } else if (error.name === "BucketNotFound") {
        res.status(404).send("Error: Bucket not found");
      } else if (error.name === "AccessDenied") {
        res.status(403).send("Error: Access denied");
      } else if (error.name === "InvalidObjectState") {
        res
          .status(404)
          .send("Error: Object is archived and cannot be accessed");
      } else if (error.message.includes("network")) {
        res
          .status(500)
          .send("Error: Networking issue. Please try again later.");
      } else {
        res
          .status(500)
          .send(
            "Error: Unable to retrieve the file from S3. " + error?.message
          );
      }
    }
  }
  public static async s3FileUploadService(req: Request, res: Response) {
    const originalName = req.file?.originalname;
    try {
      const filename = (<Express.MulterS3.File>req?.file)?.key;
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: COMMON_MESSAGE.DocumentUploadFailed,
        });
      }
      if (!filename) {
        res.status(400).json({
          success: false,
          message: COMMON_MESSAGE.DocumentUploadFailed,
        });
      }
      const url = (<Express.MulterS3.File>req?.file)?.location;
      await addMediaurl(url, false);
      if (!url) {
        responseWrapper(false, COMMON_MESSAGE.DocumentUploadFailed, 400, {
          success: false,
          message: COMMON_MESSAGE.DocumentUploadFailed,
        });
      }

      res.status(200).json({
        success: true,
        message: COMMON_MESSAGE.DocumentUploadSuccess,
        data: {
          url,
          originalName,
          filename,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as any).message ?? error,
      });
    }
  }
}
