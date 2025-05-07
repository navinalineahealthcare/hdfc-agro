import mongoose from "mongoose";
import { CampaignRequest, HDFCCasesRequest } from "../types/hdfcCases.type";
import { CaseStatusEnum, statusEnum } from "../../enums";

const HDFCCasesSchema = new mongoose.Schema(
  {
    uniqueIdNum: { type: String, default: null },
    fromDate: { type: String, default: null },
    toDate: { type: String, default: null },
    proposalNo: { type: String, default: null },
    proposerName: { type: String, default: null },
    insuredName: { type: String, default: null },
    age: { type: Number, default: null },
    gender: { type: String, default: null },
    contactNo: { type: String, default: null },
    customerEmailId: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: String, default: null },
    agentCode: { type: String, default: null },
    agentName: { type: String, default: null },
    agentEmailId: { type: String, default: null },
    agentMobile: { type: String, default: null },
    clientDob: { type: String, default: null },
    sumInsured: { type: Number, default: null },
    premium: { type: Number, default: null },
    portability: { type: String, default: null },
    productName: { type: String, default: null },
    productCode: { type: String, default: null },
    caseType: { type: String, default: null },
    testCategory: { type: String, default: null },
    tpaName: { type: String, default: null },
    tpaRemark: { type: String, default: null },
    txtZone: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: CaseStatusEnum,
      default: CaseStatusEnum.RECEIVED,
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


const HDFCCases = mongoose.model<HDFCCasesRequest>(
  "HDFCCases",
  HDFCCasesSchema
);
export default HDFCCases;
