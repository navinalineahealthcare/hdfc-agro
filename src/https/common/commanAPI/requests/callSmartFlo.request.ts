import { object, string } from "yup";

export const ClickToCallRequest = object().shape({
  alternateMobileNo: string().optional(),
  MobileNo: string().optional(),
});
