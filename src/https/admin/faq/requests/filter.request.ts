import { object, string, mixed } from "yup";
import { userTypeEnum, statusEnum } from "../types/faq.type";

export const FaqFilterRequest = object({
  question: string().optional(),
  answer: string().optional(),
  type: mixed<userTypeEnum>().oneOf(Object.values(userTypeEnum)).optional(),
  status: mixed<statusEnum>().oneOf(Object.values(statusEnum)).optional(),
  search: string().optional(),
  fromDate: string().optional(),
  toDate: string().optional(),
});
