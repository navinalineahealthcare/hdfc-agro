
import { roleTypeName } from "../../../../utils/utils";
import { adminType } from "../types/appointment.type";

export const appointmentListResponse = (data: adminType | adminType[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (admin: adminType) => {
  return {
    id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phoneCodeId: admin.phoneCodeId,
    phoneCode: admin.phoneCode,
    phoneNumber: admin.phoneNumber,
    image: admin.image,
    address: admin.address,
    roleId: admin.roleId,
    createdAt: admin.createdAt,
    notificationToken: admin.notificationToken,
    timezone: admin.timezone
  };
};