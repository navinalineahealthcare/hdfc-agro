import { sendForgotPasswordEmail } from "../mails/ForgotPasswordMail";

export const forgotPasswordUrl = `alineahealth-forgot-password-mail-queue`;

export const handleForgotPassword = async (data: any) => {
  await sendForgotPasswordEmail(data);
};
