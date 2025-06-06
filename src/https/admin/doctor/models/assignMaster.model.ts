// assignMaster.model.ts
import { model, Schema, Types, Document, Model } from "mongoose";
import { CaseStatusEnum } from "../../../common/enums";
import { IAssignMasterDoc } from "../types/doctor.types";

type AssignMasterDoc = Document & IAssignMasterDoc;

const assignMasterSchema = new Schema<AssignMasterDoc>(
  {
    requestDate: { type: Date, default: Date.now },
    proposalNo: { type: String, required: true },
    requestId: { type: String, required: true },
    proposerName: { type: String, required: true },
    insuredName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true },
    tpaName: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(CaseStatusEnum),
      default: CaseStatusEnum.RECALL,
      required: true,
    },
    doctorId: { type: Schema.Types.ObjectId, ref: "admins", default: null },
    qcDoctorId: { type: Schema.Types.ObjectId, ref: "admins", default: null },
    openCaseId: {
      type: Schema.Types.ObjectId,
      ref: "HDFCCases",
      default: null,
    },
    alternateMobileNo: { type: String, default: null },
    language: { type: String, default: null },
    callbackDate: { type: String, default: null },
    // remark: { type: [String], default: [] },
    remark: [
      {
        text: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: "admins",
          required: true,
        },
      },
    ],
    callViaPhone: { type: Boolean, default: false },
    isTeleMer: { type: Boolean, default: false },
    qcTeleMer: { type: Boolean, default: false },

    dispositionId: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "dispositions",
            default: null,
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
          changedBy: {
            type: Schema.Types.ObjectId,
            ref: "admins",
            required: true,
          },
        },
      ],
      default: [],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "admins", default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    tranScriptUrl: {
      type: { destination: String, url: String },
      default: null,
    },
    history: [
      {
        oldStatus: {
          type: String,
          enum: Object.values(CaseStatusEnum),
          required: true,
        },
        newStatus: {
          type: String,
          enum: Object.values(CaseStatusEnum),
          required: true,
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: "admins",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Define method correctly
assignMasterSchema.methods.updateStatus = async function (
  this: AssignMasterDoc,
  newStatus: CaseStatusEnum,
  changedAt: Date,
  changedBy: Types.ObjectId
) {
  this.history = this.history || [];

  this.history.push({
    oldStatus: this.status,
    newStatus,
    changedAt,
    changedBy,
  });

  this.status = newStatus;
  this.updatedAt = changedAt;
  this.createdBy = changedBy;

  await this.save(); // ✅ TypeScript now knows `save` exists
};

// ✅ Compile model
const AssignMaster = model<AssignMasterDoc>(
  "assign_masters",
  assignMasterSchema
);
export { AssignMaster, AssignMasterDoc };
