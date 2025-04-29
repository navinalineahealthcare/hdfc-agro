import mongoose, { Schema } from "mongoose";
import { permissionType } from "../type/permission.types";

const permissionSchema = new Schema(
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
        moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'modules' },
        // adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: Date,
        deletedAt: Date,
    },
    { timestamps: true }

)

const Permission = mongoose.model<permissionType>("permissions", permissionSchema);

export { permissionType, Permission };
