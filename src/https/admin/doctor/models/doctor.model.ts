import { model, Schema, Document } from "mongoose";
import { statusEnum } from "../../../common/enums";
import { DoctorType } from "../types/doctor.types";

const doctorSchema = new Schema<DoctorType>(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: null,
    },
    registrationNo: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    signatureUrl: {
      type: String,
      default: null,
    },
    stampUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.ACTIVE,
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
    dcid: {
      type: String,
    },
  },
  { timestamps: true }
);

const Doctor = model<DoctorType>("doctors", doctorSchema);

export { Doctor };
