import { Document } from "mongoose";
import { statusEnum } from "../../../common/enums";


export interface roleType extends Document {
    name: string;
    displayName: string;
    status: statusEnum;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}