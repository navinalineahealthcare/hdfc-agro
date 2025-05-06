import { object, string } from "yup";

export const DispositionFilterRequest = object().shape({
  search: string().optional(),
});

export const DispositionCreateRequest = object().shape({
  search: string().optional(),
});