
export interface userHasPermissionType extends Document {
    roleId: string;
    moduleId: string;
    permissionId: permission;
    isGranted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface permission extends Document {
    permissionId: string;
    isGranted: boolean;
}