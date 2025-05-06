import { model, Schema, Document } from "mongoose";
import { CaseStatusEnum, statusEnum } from "../../enums";
import { IDisposition } from "../types/disposition.type";


// Create the schema using the interface
const dispositionSchema = new Schema<IDisposition>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    insurerID: {
      type: String,
      default: "241",
    },
    statusReference: {
      type: String,
      enum: Object.values(CaseStatusEnum),
      default: CaseStatusEnum.RECEIVED,
    },
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.ACTIVE,
      required: true,
    },
    toSubmit: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
    },
    createdBy: {
      type: String,
      default: "System",
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create the model with the interface
const Disposition = model<IDisposition>("dispositions", dispositionSchema);

export { Disposition };
