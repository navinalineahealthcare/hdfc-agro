import mongoose, { Schema } from "mongoose";
import { roleHasPermissionType } from "../type/roleHasPermission.types";

const roleHasPermissionSchema = new Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'modules',
            required: true
        },

        permissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'permissions',
        },
        isGranted: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const RoleHasPermission = mongoose.model<roleHasPermissionType>('roleHasPermissions', roleHasPermissionSchema);

export { RoleHasPermission, roleHasPermissionType };
