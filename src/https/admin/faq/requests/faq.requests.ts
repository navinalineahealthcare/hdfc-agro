import { mixed, object, string } from "yup";
import { userTypeEnum } from "../types/faq.type";

export const faqRequest = object({
  question: string().required(),
  answer: string().required(),
  type: mixed<userTypeEnum>().oneOf(Object.values(userTypeEnum)),
});
