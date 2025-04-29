import { object, string, mixed, array, boolean } from "yup";

export const roleCreateRequest = object({
    name: string().optional(),
    displayName: string().required(),
    description: string().optional(),
});


export const RoleFilterRequest = object().shape({
    firstName: string().optional(),
    lastName: string().optional(),
    email: string().optional(),
    roleId: string().optional(),
    search: string().optional(),
    fromDate: string().optional(),
    toDate: string().optional(),
  });