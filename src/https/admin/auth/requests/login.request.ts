import { object, string } from "yup";
import { devicesEnum } from "../../../common/enums";

export const LoginRequest = object({
  email: string().email(),
  contactCode: string(),
  password: string().required(),
  // password: string().required().matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  //   'Password must contain at least 8 characters, one uppercase, one lowercase, and one number.'
  // ),
  deviceType: string().oneOf(Object.values(devicesEnum)).required(),
  notificationToken: string().optional().nullable(),
}).test(
  "at-least-one",
  "Either email or contactCode is required",
  (value) => !!(value?.email || value?.contactCode)
);
