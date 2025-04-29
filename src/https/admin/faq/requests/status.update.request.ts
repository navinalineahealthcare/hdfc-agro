import { mixed, object, string } from "yup";
import { statusEnum } from "../../auth/types/auth.type";

export const StatusUpdateRequest = object({
    status: mixed<statusEnum>().oneOf(Object.values(statusEnum))
})