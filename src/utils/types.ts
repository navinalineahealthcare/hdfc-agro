import jwt from "jsonwebtoken";

export enum PushNotificationChannels {
  DATABASE = "db",
  PUSH = "fcm",
  MAIL = "mail",
}

export enum CronEnums {
  EVERY_MINUTE = "* * * * * ",
  EVERY_FIVE_MINUTES = "*/5 * * * * ",
  EVERY_10_MINUTES = "*/10 * * * * ",
  EVERY_15_MINUTES = "*/15 * * * * ",
  EVERY_30_MINUTES = "*/30 * * * *",
  EVERY_HOUR = "0 * * * *",
  EVERYDAY_MIDNIGHT = "0 0 * * *",
}



export interface SendMailType {
  subject: string;
  email: string;
}

export interface SendLeaveAppliedMailType extends SendMailType {
  startDate: Date;
  endDate: Date;
  fullName: string;
  otherUserFullName: string;
  count: number;
}
export interface SendMemberAddedMailType extends SendMailType {
  fullName: string;
  otherUserFullName: string;
}
export interface SendLeaveResponseType extends SendMailType {
  fullName: string;
  startDate: string;
  endDate: string;
  status: string;
}


export enum UPLOAD_TYPES {
  IMAGE,
  VIDEO,
  FILE,
  IMAGE_VIDEO,
  PDF

}

export enum UPLOAD_FOLDER {
  Dump_HDFC_Cases = "DUMPHDFCCASES",
  HDFC_Cases = "HDFCCASES",
  HDFC_Cases_Images = "HDFCCASESIMAGES",
}

export const ALLOWED_IMAGE_TYPE = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
];

export const ALLOWED_VIDEO_TYPE = ["video/mp4", "video/mov", "video/quicktime", "video/x-m4v", "application/octet-stream", "video/avi"];

export const ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export const ALLOWED_UPLOAD_FOLDER = [
  "HDFCCASESIMAGES",
  "HDFCCASES",
  "DUMPHDFCCASES",
  "HDFCCASESIMAGES",
  "HDFCCASES",
  "DUMPHDFCCASES",
]

export interface verifyTokenType {
  idToken: string;
  clientId: string;
}

export interface VerifyAppleIdTokenResponse extends jwt.JwtPayload {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  nonce?: string;
  nonce_supported: boolean;
  email: string;
  email_verified: boolean;
  is_private_email?: boolean;
  real_user_status?: number;
  transfer_sub?: string;
  c_hash: string;
}