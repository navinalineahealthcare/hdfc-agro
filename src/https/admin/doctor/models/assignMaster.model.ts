import { model, Schema, Document } from "mongoose";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";
import { IAssignMaster } from "../types/doctor.types";

const assignMasterSchema = new Schema<IAssignMaster>(
  {
    requestDate: {
      type: Date,
      default: Date.now,
    },
    proposalNo: {
      type: String,
      required: true,
    },
    proposerName: {
      type: String,
      required: true,
    },
    insuredName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CaseStatusEnum),
      default: CaseStatusEnum.RECALL,
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      default: null,
    },
    openCaseId: {
      type: Schema.Types.ObjectId,
      ref: "HDFCCases",
      default: null,
    },
    alternateMobileNo: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: null,
    },
    callbackDate: {
      type: Date,
      default: null,
    },
    remark: {
      type: [String],
      default: [],
    },
    callViaPhone: {
      type: Boolean,
      default: false,
    },
    dispositionId: {
      type: Schema.Types.ObjectId,
      ref: "dispositions",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const AssignMaster = model<IAssignMaster>("assign_masters", assignMasterSchema);

export { AssignMaster };
