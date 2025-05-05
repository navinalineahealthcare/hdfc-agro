import { execSync } from "child_process";
import * as XLSX from "xlsx";
import fs from "fs";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { Permission } from "../https/admin/role-and-permission/models/permission";
import { RoleHasPermission } from "../https/admin/role-and-permission/models/roleHasPermission";
import City from "../https/country-state-city/models/city.model";
import Country from "../https/country-state-city/models/country.model";
import State from "../https/country-state-city/models/state.model";
import { S3 } from "../libs/s3/s3";
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPE,
  ALLOWED_UPLOAD_FOLDER,
  ALLOWED_VIDEO_TYPE,
  UPLOAD_FOLDER,
  UPLOAD_TYPES,
} from "./types";

import axios from "axios";
import { logger } from "../providers/logger";
import { rolesEnum } from "../https/common/enums";
import { env } from "../env";
import { s3Client } from "../middleware/Storage";

export const pagination = (
  totalCount: number,
  perPage: number,
  page: number
) => {
  return {
    total: totalCount,
    per_page: perPage,
    current_page: page,
    last_page: Math.ceil(totalCount / perPage),
  };
};

export const randomPasswordGenerator = () => {
  return Math.random().toString(36).slice(-8);
};

export const validFileTypes = (type: UPLOAD_TYPES) => {
  if (type === UPLOAD_TYPES.IMAGE) {
    return ALLOWED_IMAGE_TYPE;
  } else if (type === UPLOAD_TYPES.VIDEO) {
    return ALLOWED_VIDEO_TYPE;
  } else if (type === UPLOAD_TYPES.FILE) {
    return ALLOWED_FILE_TYPES;
  } else if (type === UPLOAD_TYPES.IMAGE_VIDEO) {
    return [
      ...ALLOWED_IMAGE_TYPE,
      ...ALLOWED_VIDEO_TYPE,
      ...ALLOWED_FILE_TYPES,
    ];
  }
  return [];
};

export const validFolderTypes = (type: UPLOAD_FOLDER) => {
  if (ALLOWED_UPLOAD_FOLDER.indexOf(type) != -1) {
    return true;
  }

  return false;
};

export const generatePassword = () => {
  const passwordLength = 10;
  const allowedChars = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
  };

  let password = "";
  let includeUpper = false;
  let includeLower = false;
  let includeNumber = false;

  // Ensure at least one capital letter
  while (!includeUpper) {
    const randomIndex = Math.floor(Math.random() * allowedChars.upper.length);
    const char = allowedChars.upper[randomIndex];
    password += char;
    includeUpper = true;
  }

  // Ensure at least one small letter
  while (!includeLower) {
    const randomIndex = Math.floor(Math.random() * allowedChars.lower.length);
    const char = allowedChars.lower[randomIndex];
    password += char;
    includeLower = true;
  }

  // Ensure at least one number
  while (!includeNumber) {
    const randomIndex = Math.floor(Math.random() * allowedChars.number.length);
    const char = allowedChars.number[randomIndex];
    password += char;
    includeNumber = true;
  }

  // Fill the remaining characters with a mix of capital, small, and number
  while (password.length < passwordLength) {
    const randomCategory = Math.floor(Math.random() * 3);
    let chars;

    switch (randomCategory) {
      case 0:
        chars = allowedChars.upper;
        break;
      case 1:
        chars = allowedChars.lower;
        break;
      default:
        chars = allowedChars.number;
    }

    const randomIndex = Math.floor(Math.random() * chars.length);
    const char = chars[randomIndex];
    password += char;
  }

  return password;
};

export const STORAGE_PATH = "src/storage/uploads";

export const convertVideoToFrames = async (
  inputPath: string,
  outputPath: string
) => {
  try {
    const inputVideoPath = inputPath;
    const outputImagePath = outputPath + "/%04d.png";

    if (!fs.existsSync("./src/storage/frames/")) {
      fs.mkdirSync("./src/storage/frames/", { recursive: true });
    }

    const ffmpegCommand = `ffmpeg -i ${inputVideoPath} -vf fps=1/1 ${outputImagePath}`;

    // Execute the ffmpeg command
    await execSync(ffmpegCommand);

    // The frame has been extracted from the video
    return;
  } catch (error) {
    return error;
  }
};

export const deleteS3Media = async (url: string) => {
  try {
    await S3.S3deleteObject(url.split("aws.com/")[1]);
    return true;
  } catch (error: any) {
    return false;
  }
};
export const removeFromS3 = async ({ key }: { key: string }) => {
  const bucketParams = { Bucket: env.aws.bucket, Key: key };
  try {
    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    return data;
  } catch (err) {
    logger.error("Error in remove from s3 bucket" + (err as any)?.message);
    return null;
  }
};

export const verifyFileisAvailable = async (
  url: string,
  folderName: string
) => {
  try {
    if (url.indexOf(folderName) == -1) {
      return false;
    }
    await S3.verifyFile(url);
    return true;
  } catch (error: any) {
    return false;
  }
};

export const roleTypeName = (role: rolesEnum) => {
  let roleName;
  if (role === rolesEnum.SUPER_ADMIN) {
    return (roleName = "Super Admin");
  } else if (role === rolesEnum.ADMIN) {
    return (roleName = "Admin");
  } else {
    return (roleName = "QC");
  }
};
export const verifyCountry = async (id: string) => {
  try {
    const country = await Country.findOne({
      _id: id,
    });
    if (!country) {
      throw Error("error=========");
    }
  } catch (error: any) {}
};

export const verifyState = async (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const state = await State.findOne({
        _id: id,
      });
      if (!state) {
        return reject("State not found");
      }

      return resolve(true);
    } catch (error: any) {
      return reject(error);
    }
  });
};

export const verifyCity = async (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await City.findOne({
        _id: id,
      });
      if (!city) {
        return reject("City not found");
      }

      return resolve(true);
    } catch (error: any) {
      return reject(error);
    }
  });
};

export const randomNumber = (prefix?: string) => {
  return prefix ?? "" + (Math.floor(Math.random() * 9000000000) + 1000000000);
};

export enum CronEnums {
  EVERY_MINUTE = "* * * * * ",
  EVERY_FIVE_MINUTES = "*/5 * * * * ",
  EVERY_10_MINUTES = "*/10 * * * * ",
  EVERY_15_MINUTES = "*/15 * * * * ",
  EVERY_30_MINUTES = "*/30 * * * *",
  EVERY_HOUR = "0 * * * *",
  EVERY_23_HOUR = "23 * * * *",
  EVERYDAY_MIDNIGHT = "0 0 * * *",
}

export enum statusEnumText {
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PENDING = "Pending",
  EXPIRED = "Expired",
  COMPLETED = "Completed",
}

export enum testDriveVistingStatusEnumText {
  PENDING = "Pending",
  VISITED = "Visited",
  MISSED = "Missed",
}

export enum activityEnumStatusText {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export const APIGETRequest = async (
  url: string,
  params: object,
  logType: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(url, {
        params,
      });
      logger.info(
        logType + ": API url: " + url + " API response: " + JSON.stringify(data)
      );
      resolve(data);
    } catch (error: any) {
      logger.error(logType + ": " + error.message);
      reject(error);
    }
  });
};

export const createDefultRolePermission = async (roleId: string) => {
  const allPermissions = await Permission.find();
  for (const permissionData of allPermissions) {
    const permissionExists = await RoleHasPermission.findOne({
      permissionId: permissionData._id,
      moduleId: permissionData.moduleId,
      roleId: roleId,
    });

    if (permissionExists) {
      await RoleHasPermission.updateOne(
        {
          permissionId: permissionData._id,
          moduleId: permissionData.moduleId,
          roleId: roleId,
        },
        {
          $set: {
            permissionId: permissionData._id,
            moduleId: permissionData.moduleId,
            roleId: roleId,
          },
        }
      );
    } else {
      await RoleHasPermission.create({
        permissionId: permissionData._id,
        moduleId: permissionData.moduleId,
        roleId: roleId,
      });
    }
  }
};

export const formatTimelast = (totalSeconds: any) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};
export const sanitizedFileName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s.-]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
};

export const maskMobile = (mobile: number): string => {
  const str = mobile.toString();
  return str.slice(0, 3) + "****" + str.slice(-3);
};

export function getMonthName(
  monthIndex = new Date().getMonth(),
  year = new Date().getFullYear
): string {
  const date = new Date(monthIndex, monthIndex); // Year doesn't matter for the name
  return date.toLocaleString("default", { month: "long" });
}

export const internalUploadToS3 = async ({
  fileBuffer,
  fileName,
  mimeType,
  requestId,
  destinationUrl,
}: {
  fileBuffer: Uint8Array;
  fileName: string;
  mimeType: string;
  requestId: string;
  destinationUrl: string;
}) => {
  const bucketName = env.aws.bucket;
  const today = new Date();
  const destination = `${destinationUrl}/${today.getFullYear()}/${getMonthName()}/egro/${requestId}/${fileName}`;

  const bucketParams = {
    Bucket: bucketName,
    Key: destination,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(bucketParams));
    const fileUrl = `https://${bucketName}.s3.${env.aws.bucket}.amazonaws.com/${destination}`;
    logger.info("File uploaded successfully to S3: " + fileUrl, {
      log: "info",
    });
    return { destination, url: fileUrl };
  } catch (err) {
    logger.error("Error in internalUploadToS3: " + (err as any)?.message, {
      log: "error",
      data: err,
    });
    return null;
  }
};

export async function getFileBufferFromS3(key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: env.aws.bucket,
      Key: key,
    });
    const { Body } = await s3Client.send(command);

    const streamToBuffer = async (stream: any): Promise<Buffer> => {
      const chunks: any[] = [];
      for await (const chunk of stream) chunks.push(chunk);
      return Buffer.concat(chunks);
    };

    if (!Body) throw new Error("No file body returned from S3.");
    const buffer = await streamToBuffer(Body);
    return buffer;
  } catch (error) {
    logger.error("Error fetching file from S3 getFileBufferFromS3:", error);
    throw error;
  }
}

export const parseExcelDate = (value: any): string | null => {
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return null;
    const dd = String(date.d).padStart(2, '0');
    const mm = String(date.m).padStart(2, '0');
    const yyyy = date.y;
    return `${dd}/${mm}/${yyyy}`;
  } else if (typeof value === 'string') {
    return value; // Already a proper date string
  }
  return null;
};

