import { Document } from "mongoose";


export interface permissionType extends Document {
    name: string;
    displayName: string;
    moduleId: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}