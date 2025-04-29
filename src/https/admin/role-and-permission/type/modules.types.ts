import { Document } from "mongoose";

export enum statusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface moduleType extends Document {
    name: string;
    displayName:string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}