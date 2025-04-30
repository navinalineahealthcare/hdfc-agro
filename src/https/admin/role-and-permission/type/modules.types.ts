import { Document } from "mongoose";


export interface moduleType extends Document {
    name: string;
    displayName:string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}