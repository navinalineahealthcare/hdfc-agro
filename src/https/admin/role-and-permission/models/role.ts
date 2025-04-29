import mongoose, { Schema } from "mongoose";
import { roleType, statusEnum } from "../type/role.types";

const roleSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        displayName: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            enum: statusEnum,
            default: statusEnum.ACTIVE,
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

const Role = mongoose.model<roleType>("roles", roleSchema);

export { roleType, Role };

