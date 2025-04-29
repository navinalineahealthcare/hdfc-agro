import { object, string, mixed } from "yup";

export const idRoleHasPermissionParamsRequest = object({
    id: string().required(),
});