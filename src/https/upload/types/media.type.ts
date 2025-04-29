import { Document } from "mongoose";

export interface mediaType extends Document {
    url: string;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}