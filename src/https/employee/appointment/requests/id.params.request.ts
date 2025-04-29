import { object, string } from "yup";

export const IdQueryParamRequest = object({
    id: string().trim().required(),
})
