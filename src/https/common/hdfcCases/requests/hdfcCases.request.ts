import { object, string } from "yup";
export const CountryProvinceCityRequest = object({
    name: string().optional(),
    ios2: string().optional(),
});