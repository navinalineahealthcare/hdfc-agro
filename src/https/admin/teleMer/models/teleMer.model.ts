import { Schema, model } from "mongoose";
import { statusEnum } from "../../../common/enums";
import { EnumTeleMer, ITeleMer } from "../types/teleMer.types";

const teleMerSchema = new Schema<ITeleMer>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    proposalNo: {
      type: String,
      default: null,
    },
    teleMerData: {
      type: Schema.Types.Mixed, // Use Mixed for flexible JSON-like structure
      default: null,
    },
    qcTeleMerData: {
      type: Schema.Types.Mixed, // Use Mixed for flexible JSON-like structure
      default: null,
    },
    isTeleMer: { type: Boolean, default: false },
    qcTeleMer: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(EnumTeleMer) as EnumTeleMer[],
      default: statusEnum.ACTIVE as unknown as EnumTeleMer,
      required: true,
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

const TeleMer = model<ITeleMer>("tele_mers", teleMerSchema);

export { TeleMer };
