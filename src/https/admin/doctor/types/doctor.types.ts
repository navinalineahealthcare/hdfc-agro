import { Schema, Types } from "mongoose";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";

export interface DoctorType extends Document {
  name: string;
  userId: string;
  registrationNo: string;
  photoUrl?: string;
  signatureUrl?: string;
  stampUrl?: string;
  isActive: boolean;
  createdDatetime?: Date;
  createdBy: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: statusEnum;
  dcid?: string;
}

export interface IAssignMasterAttrs {
  requestDate: Date;
  proposalNo: string;
  proposerName: string;
  insuredName: string;
  tpaName?: string;
  mobileNo: string;
  email: string;
  status: CaseStatusEnum;
  doctorId: Types.ObjectId;
  qcDoctorId: Types.ObjectId;
  openCaseId?: Types.ObjectId;
  alternateMobileNo?: string;
  language?: string;
  callbackDate?: Date;
  play?: boolean;
  remark?: {
    text: string;
    changedAt: Date;
    changedBy: Types.ObjectId;
  }[];
  callViaPhone?: boolean;
  isTeleMer?: boolean;
  qcTeleMer?: boolean;
  merLink?: string;
  unLinkCase?: string;
  // dispositionId?: Types.ObjectId;
  dispositionId?: {
    id: Types.ObjectId | null;
    changedAt: Date;
    changedBy: Types.ObjectId;
  }[];

  createdBy?: Types.ObjectId;
  createdAt?: Date;
  requestAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  tranScriptUrl?: { destination: string; url: string } | null;
  history?: {
    oldStatus: CaseStatusEnum;
    newStatus: CaseStatusEnum;
    changedAt: Date;
    changedBy: Types.ObjectId;
  }[];
}

// Final document type with instance methods
export interface IAssignMasterDoc extends Document, IAssignMasterAttrs {
  requestId: string;
  updateStatus: (
    newStatus: CaseStatusEnum,
    changedAt: Date,
    changedBy: Types.ObjectId
  ) => Promise<void>;
}
