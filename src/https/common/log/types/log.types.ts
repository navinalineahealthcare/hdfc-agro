import { Document } from "mongoose";

export interface logType extends Document {
    userId: string;
    moduleType: string;
    moduleName: string;
    logType: string;
    description: string;
    createdAt: Date;
}