
import { object, string, ref } from "yup";

export const ResetPasswordRequest = object({
  password: string().required().matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    'Password must contain at least 8 characters, one uppercase, one lowercase, and one number.'
  ),
  current_password:string().optional(),
  confirm_password: string()
    .required()
    .oneOf([ref("password")], "confirm password and password must be same"),

});
