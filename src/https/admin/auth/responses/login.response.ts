import { adminType } from "../types/auth.type";

export const loginResponse = (data: adminType | adminType[]) => {
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
    phoneCode: admin.phoneCode,
    phoneNumber: admin.phoneNumber,
    image: admin.image,
    address: admin.address,
    //@ts-ignore
    role: admin.roleId.name,
    createdAt: admin.createdAt,
  };
};
