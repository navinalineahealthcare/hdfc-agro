import { object, string } from "yup";

export const ProfileUpdateRequest = object({
    firstName: string().optional(),
    lastName: string().optional(),
    password: string().optional().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Password must contain at least 8 characters, one uppercase, one lowercase, and one number.'
    ),
    countryId: string().optional(),
    stateId: string().optional(),
    cityId: string().optional(),
    phoneCodeId: string().optional(),
    phoneCode: string().optional(),
    phoneNumber: string().optional().matches(
        /^[0-9]{6,13}$/,
        'Phone numbers must contain only numeric characters and must have a minimum length of 6 digits and a maximum length of 13 digits.'
    ),
    address: string().optional(),
    image: string().optional(),
});