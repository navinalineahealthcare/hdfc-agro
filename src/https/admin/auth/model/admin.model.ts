import { model, Schema, Model } from "mongoose";
import { adminType } from "../types/auth.type";
import { statusEnum } from "../../../common/enums";

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    forgotPasswordToken: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.ACTIVE,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
    phoneCodeId: {
      type: Schema.Types.ObjectId,
    },
    phoneCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    phonePreferenceRequest: {
      type: Boolean,
      default: false,
    },
    internetPreferenceRequest: {
      type: Boolean,
      default: false,
    },
    emailPreferenceRequest: {
      type: Boolean,
      default: false,
    },
    phonePreferenceUpdate: {
      type: Boolean,
      default: false,
    },
    internetPreferenceUpdate: {
      type: Boolean,
      default: false,
    },
    emailPreferenceUpdate: {
      type: Boolean,
      default: false,
    },
    reportPreference: {
      type: Boolean,
      default: false,
    },
    notificationToken: {
      type: String,
    },
    uhc_employee_id: {
      type: String,
    },
    changepasswordBlocked: {
      type: Boolean,
      default: false,
    },
    userID: {
      type: String,
    },
    officeId: {
      type: Schema.Types.ObjectId,
    },
    insuDCUHCId: {
      type: String,
    },
    insuDCUHCflag: {
      type: Boolean,
      default: false,
    },
    reportTo: {
      type: Schema.Types.ObjectId,
      ref: "admins", // assuming reporting to another admin
    },
    addressID: {
      type: Schema.Types.ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
    updatedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

const Admin = model<adminType>("admins", adminSchema);

export { adminType, Admin };
