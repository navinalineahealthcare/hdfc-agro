import { Document, Schema, Types } from "mongoose";
import { devicesEnum, rolesEnum, statusEnum } from "../../../common/enums";
// export interface IAdminType {
//   firstName: string;
//   lastName: string;
//   contactCode: string;
//   email?: string;
//   password: string;
//   forgotPasswordToken: string;
//   status: string;
//   role: string;
//   roleId?: Schema.Types.ObjectId;
//   phoneCode: string;
//   phoneNumber: string;
//   address?: string | null;
//   image?: string | null;
//   phonePreferenceRequest?: boolean;
//   internetPreferenceRequest?: boolean;
//   emailPreferenceRequest?: boolean;
//   phonePreferenceUpdate?: boolean;
//   internetPreferenceUpdate?: boolean;
//   emailPreferenceUpdate?: boolean;
//   reportPreference?: boolean;
//   notificationToken?: string;
//   uhcEmployeeId?: string;
//   changepasswordBlocked?: boolean;
//   officeId?: Schema.Types.ObjectId;
//   insuDCUHCId?: string;
//   insuDCUHCflag?: boolean;
//   reportTo?: Schema.Types.ObjectId;
//   addressID?: Schema.Types.ObjectId;
//   createdBy?: Schema.Types.ObjectId | string;
//   updatedAt?: Date;
//   updatedBy?: Schema.Types.ObjectId | string;
//   createdAt?: Date;
//   deletedAt?: Date | null;
// }

export interface IAdminType {
  firstName: string;
  lastName: string;
  contactCode: string;
  email?: string;
  password: string;
  forgotPasswordToken: string;
  status: string;
  role: string;
  roleId?: Types.ObjectId | string;
  phoneCode: string;
  phoneNumber: string;
  homeAddID?: string;
  address?: string;
  address2?: string | null;
  city?: string | null;
  dist?: string | null;
  state?: string | null;
  pincode?: string | null;
  image?: string | null;
  phonePreferenceRequest?: boolean;
  internetPreferenceRequest?: boolean;
  emailPreferenceRequest?: boolean;
  phonePreferenceUpdate?: boolean;
  internetPreferenceUpdate?: boolean;
  emailPreferenceUpdate?: boolean;
  reportPreference?: boolean;
  notificationToken?: string;
  uhcEmployeeId?: string;
  changepasswordBlocked?: boolean;
  officeId?: Types.ObjectId;
  insuDCUHCId?: string;
  insuDCUHCflag?: boolean;
  reportTo?: Types.ObjectId;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface adminType extends Document, IAdminType {}

export interface deviceType extends Document {
  userId: string;
  authToken: string;
  device: devicesEnum;
  notificationToken: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
