import { statusEnum } from "../../../common/enums";

export interface DoctorType extends Document {
  name: string;
  userId: string;
  registrationNo: string;
  photoUrl?: string;
  signatureUrl?: string;
  stampUrl?: string;
  isActive: boolean;
  createdDatetime?: Date;
  createdBy: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: statusEnum;
  dcid?: string;
}
