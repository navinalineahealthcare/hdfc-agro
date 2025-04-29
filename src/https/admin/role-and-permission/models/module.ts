import mongoose, { Schema } from "mongoose";
import { moduleType } from "../type/modules.types";

const moduleSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        displayName: {
            type: String,
            require: true,
        },
        description: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: Date,
        deletedAt: Date,
    },
    { timestamps: true }

)

const Module = mongoose.model<moduleType>("modules", moduleSchema);

export { moduleType, Module };
