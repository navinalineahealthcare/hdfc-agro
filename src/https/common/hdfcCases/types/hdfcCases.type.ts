import { Document } from "mongoose";
import { statusEnum } from "../../enums";

export interface UserDataType {
  uniqueIdNum: string;
  fromDate: Date;
  toDate: Date;
  createdDate: Date;
  proposalNo: string;
  proposerName: string;
  insuredName: string;
  age: number;
  gender: string;
  contactNo: string;
  customerEmailId: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  agentCode: string;
  agentName: string;
  agentEmailId: string;
  agentMobile: string;
  clientDob: Date;
  sumInsured: number;
  premium: number;
  portability: string;
  productName: string;
  productCode: string;
  caseType: string;
  testCategory: string;
  tpaName: string;
  tpaRemark: string;
  txtZone: string;
}

export interface HDFCCasesRequest extends UserDataType, Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  status: statusEnum;
}

export interface CampaignRequest extends Document {
  campaignId: number;
  campaignName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  status: statusEnum;
}
export interface AgentCampaignRequest extends Document {
  agentNumber: string;
  callerId: string;
  callerUserId: string;
  campaignId: number;
  status: statusEnum;
  deletedAt?: Date | null;
  updatedAt?: Date;
  createdAt?: Date;
}
