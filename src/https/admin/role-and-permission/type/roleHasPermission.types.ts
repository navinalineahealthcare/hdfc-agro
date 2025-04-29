import { Document } from "mongoose";

export interface roleHasPermissionType extends Document {
    roleId: string;
    moduleId: string;
    permissionId: permission;
    isGranted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
// export interface roleHasPermissionType extends Document {
//     roleId: string;
//     moduleId: string;
//     permissions: permission;
//     createdAt: Date;
//     updatedAt: Date;
//     deletedAt: Date | null;
// }

// export interface modulewithpermission extends Document {
//     moduleId: string;
//     permissions: permission;
// }
export interface permission extends Document {
    permissionId: string;
    isGranted: boolean;
}

// export interface roleHasPermissionType extends Document {
//     roleId: string;
//     moduleWithPermission: modulewithpermission;
//     createdAt: Date;
//     updatedAt: Date;
//     deletedAt: Date | null;
// }

// export interface modulewithpermission extends Document {
//     moduleId: string;
//     permissions: permission;
// }
// export interface permission extends Document {
//     permissionId: string;
//     isGranted: boolean;
// }