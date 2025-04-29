import { S3Client } from '@aws-sdk/client-s3';
import AWS from "aws-sdk";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import multers3 from 'multer-s3';
import { env } from "../env";
import { ALLOWED_UPLOAD_FOLDER, UPLOAD_TYPES } from "../utils/types";
import { validFileTypes, validFolderTypes } from "../utils/utils";

const s3 = new S3Client(
  {
    credentials: {
      accessKeyId: env.aws.accessKey,
      secretAccessKey: env.aws.secretAccessKey
    },
    region: env.aws.region
  }
)

AWS.config.update({
  accessKeyId: env.aws.accessKey,
  secretAccessKey: env.aws.secretAccessKey,
  region: env.aws.region,
});

// Create an S3 instance
const awsS3 = new AWS.S3();

async function doesFolderExist(bucketName: string, folderName: string) {
  try {
    const data:any = await awsS3.listObjectsV2({ Bucket: bucketName, Prefix: folderName }).promise();
    return data.Contents.length > 0;
  } catch (error) {
    return false;
  }
}

export const UploadSingleFile =
  (type: UPLOAD_TYPES, name: string) =>
    async (req: Request, res: Response, next: NextFunction) => {

      configuredMulter(type).single(name)(req, res, (error) => {
        if (error && error.code == "LIMIT_FILE_SIZE") {
           res.status(400).send({
            status: false,
            message: "Maximum file size should be 30MB",
          });
        }
        if (error) {
           res.send({
            status: false,
            message:
              error?.message || "Something went wrong while uploading asset",
          });
        }

        next();
      });
    };

/**
 * a configured multer instance
 * @param type
 * @returns
 */
const configuredMulter = (type: UPLOAD_TYPES) => {
  return multer({
    storage: storageManager,
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
    fileFilter: function (req, file, cb) {
      const value = validFolderTypes(req.body.folder);

      if (!value) {
        cb(
          new Error(
            `Invalid upload folder. Please send folder name any of these types: ${ALLOWED_UPLOAD_FOLDER}`
          )
        );
      }


      const availableTypes = validFileTypes(type);

      if (!availableTypes.includes(file.mimetype)) {
        //if the file type does not match the allowed types, then return false
        cb(
          new Error(
            `Invalid file type.Please upload any of these types : ${availableTypes.concat()}`
          )
        );
      }

      if (req.file && req.file?.size > 1024 * 1024 * 30) {
        cb(new Error("File size exceeds the limit of 30MB"));
      }

      cb(null, true);
    },
  });
};

const storageManager = multers3({
  s3: s3,
  acl: 'public-read',
  bucket: env.aws.bucket,
  contentType: multers3.AUTO_CONTENT_TYPE,

  metadata: function (req: any, file: any, cb: any) {
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    cb(null, { fieldName: file.fieldname, extension: fileExtension?.slice(1) });
  },
  key: async function (req: any, file: any, cb: any) {
    
    // Create empty folder in s3 if folder not exist
    if(!await doesFolderExist("corporate-dev", '/'+req.body.folder)){
      await awsS3.putObject({
        Key: '/'+req.body.folder, 
        Bucket: `${env.aws.bucket}`,
      });

    }

    const { originalname } = file;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = originalname.slice(originalname.lastIndexOf("."));
    // cb(null, `${uniqueSuffix}${fileExtension}`);
    cb(null, req.body.folder + "/" + uniqueSuffix + fileExtension);
  }

})

