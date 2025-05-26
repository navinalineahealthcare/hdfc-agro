import { object, string } from "yup";
import { devicesEnum } from "../../../common/enums";

export const LoginWithproposalNumRequest = object({
  proposalNum: string().required(),
  deviceType: string().oneOf(Object.values(devicesEnum)).required(),
  notificationToken: string().optional().nullable(),
});
