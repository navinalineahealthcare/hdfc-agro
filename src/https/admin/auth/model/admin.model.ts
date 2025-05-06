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
      default: null,
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
      required: true,
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
    address2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    dist: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    pincode: {
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
    homeAddID: {
      type: String,
      default: null,
    },
    officeId: {
      type: Schema.Types.ObjectId,
      ref: "offices",
      default: null,
    },
    insuDCUHCId: {
      type: String,
      default: null,
    },
    insuDCUHCflag: {
      type: Boolean,
      default: false,
    },
    reportTo: {
      type: Schema.Types.ObjectId,
      ref: "admins", // assuming reporting to another admin
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins", 
      default: null,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      default: null,
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
