import { Document } from "mongoose";

export enum statusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum userTypeEnum {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
}

export interface faqType extends Document {
  question: string;
  answer: string;
  type: userTypeEnum;
  status: statusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
