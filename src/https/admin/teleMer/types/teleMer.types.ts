import { Types } from "mongoose";

export enum EnumTeleMer {
  RECEIVED = "Received",
  RECALL = "Recall",
  SENT_TO_QC = "Sent to QC",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
// TypeScript interface for type checking
export interface ITeleMer extends Document {
  caseId: Types.ObjectId;
  description?: string;
  proposalNo: string;
  userId: Types.ObjectId;
  teleMerData?: Record<string, any> | null;
  qcTeleMerData?: Record<string, any> | null;
  isTeleMer?: Boolean;
  qcTeleMer?: Boolean;
  status: EnumTeleMer;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
