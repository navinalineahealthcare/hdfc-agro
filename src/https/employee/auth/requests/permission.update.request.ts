import { object, string, mixed, array, boolean } from "yup";

const permissionSchema = object({
    _id: string().required(),
    isGranted: boolean().required(),
});

const moduleSchema = object({
    moduleId: string().required(),
    permissions: array().of(permissionSchema).required(),
});

export const PermissionUpdateReuest = object({
    moduleWithPermission: array().of(moduleSchema).required(),
});