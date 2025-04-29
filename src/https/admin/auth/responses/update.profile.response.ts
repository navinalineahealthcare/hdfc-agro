import { adminType } from "../../auth/types/auth.type";

export const updateProfileResponse = (data: adminType | adminType[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (admin: adminType) => {
  return {
    id:admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    roleId: admin.roleId,
    status:admin.status,
    country: admin.countryId,
    state: admin.stateId,
    city: admin.cityId,
    phoneCodeId: admin.phoneCodeId,
    phoneCode: admin.phoneCode,
    phoneNumber: admin.phoneNumber,
    address: admin.address,
    image: admin.image,
    countryId: admin.countryId,
    stateId: admin.stateId,
  };
};