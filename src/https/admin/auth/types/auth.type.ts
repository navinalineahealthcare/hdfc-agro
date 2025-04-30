import { Document, Schema } from "mongoose";
import { devicesEnum, rolesEnum, statusEnum } from "../../../common/enums";

// export interface adminType extends Document {
//   firstName: string;
//   lastName: string;
//   email: string;
//   contactCode: string;
//   password: string | null;
//   forgotPasswordToken: string | null;
//   socialId?: string | null;
//   status: statusEnum;
//   role: rolesEnum;
//   roleId: string;
//   image: string;
//   phoneCodeId: string;
//   phoneCode: string;
//   phoneNumber: string;
//   address: string;
//   notificationToken?: any;
//   timezone?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   createdBy: string;
//   updatedBy?: string;
//   deletedAt: Date | null;
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
  roleId?: Schema.Types.ObjectId;
  phoneCode: string;
  phoneNumber: string;
  address?: string | null;
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
  officeId?: Schema.Types.ObjectId;
  insuDCUHCId?: string;
  insuDCUHCflag?: boolean;
  reportTo?: Schema.Types.ObjectId;
  addressID?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId | string;
  updatedAt?: Date;
  updatedBy?: Schema.Types.ObjectId | string;
  createdAt?: Date;
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
