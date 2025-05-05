import { date, object, string } from "yup";

export const DoctorFilterRequest = object().shape({
  proposerName: string().optional(),
  productName: string().optional(),
  search: string().optional(),
  fromDate: date().optional(),
  toDate: date().optional(),
});
