
import { Schema } from "mongoose";
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

export interface IAssignMaster extends Document {
  requestDate: Date;
  proposalNo: string;
  proposerName: string;
  insuredName: string;
  mobileNo: string;
  email: string;
  status: CaseStatusEnum;
  doctorId: Schema.Types.ObjectId;
  openCaseId?: Schema.Types.ObjectId;
  alternateMobileNo?: string;
  language?: string;
  callbackDate?: Date;
  play?: boolean;
  remark?: string[];
  callViaPhone?: boolean;
  merLink?: string;
  unLinkCase?: string;
  dispositionId?: Schema.Types.ObjectId;
  createdBy?: string;
  createdAt?: Date;
  requestAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

