import { Document } from "mongoose";

export enum statusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface roleType extends Document {
    name: string;
    displayName: string;
    status: statusEnum;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}