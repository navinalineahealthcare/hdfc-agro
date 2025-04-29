import { object, string } from "yup";

export const IdQueryParamRequestFaq = object({
  id: string().trim(),
});
