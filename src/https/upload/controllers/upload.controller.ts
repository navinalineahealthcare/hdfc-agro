import { Request, Response } from "express";
import { addMediaurl } from "../services/media.service";
import { UploadedFile } from "../types/upload.type";

export class UploadController {
  public static async uploadData(req: Request, res: Response) {
    try {
      const file = req.file as UploadedFile;
      file.path = file.location.replace(/%2F/g, "/");
      // Added media url
      await addMediaurl(file.path, false);

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
}
