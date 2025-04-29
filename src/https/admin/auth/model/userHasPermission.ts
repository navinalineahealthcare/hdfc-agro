import mongoose, { Schema } from "mongoose";
import { userHasPermissionType } from "../types/userHasPermission.type";


const userHasPermissionSchema = new Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'admins',
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
        updatedAt: Date,
        deletedAt: Date,
    },
    { timestamps: true }
);

const UserHasPermission = mongoose.model<userHasPermissionType>('userHasPermissions', userHasPermissionSchema);

export { UserHasPermission, userHasPermissionType };
