import { Document } from "mongoose";
import { devicesEnum, rolesEnum, statusEnum } from "../../../common/enums";



export interface adminType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  forgotPasswordToken: string | null;
  socialId: string | null;
  status: statusEnum;
  role: rolesEnum;
  roleId: string;
  countryId: object;
  stateId: object;
  cityId: object;
  image: string;
  phoneCodeId: string;
  phoneCode: string;
  phoneNumber: string;
  address: string;
  notificationToken: any;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface deviceType extends Document {
  userId: string;
  authToken: string;
  device: devicesEnum;
  notificationToken: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
