import { object, string } from "yup";

export const SetNotificationTokenRequest = object({
    notificationToken: string().required()
})