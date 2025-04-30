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
    contactCode: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
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
      default: null,
    },
    image: {
      type: String,
      default: null,
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
    uhcEmployeeId: {
      type: String,
    },
    changepasswordBlocked: {
      type: Boolean,
      default: false,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins", // assuming reporting to another admin
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "admins", // assuming reporting to another admin
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Admin = model<adminType>("admins", adminSchema);

export { adminType, Admin };
