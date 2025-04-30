import { model, Schema, Document } from "mongoose";
import { statusEnum } from "../../../common/enums";


export interface AddressType extends Document {
  address: string;
  address2?: string;
  city: string;
  dist?: string;
  state: string;
  pincode: string;
  mobile: string;
  phone?: string;
  fax?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: statusEnum;
  dcid?: string;
}

const addressSchema = new Schema<AddressType>(
  {
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
      required: true,
    },
    dist: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    fax: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.ACTIVE,
      required: true,
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

// Finally, export the Mongoose model
const Address = model<AddressType>("addresses", addressSchema);

export { Address };
