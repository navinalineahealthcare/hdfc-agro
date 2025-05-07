import { array, date, object, string } from "yup";

export const DoctorFilterRequest = object().shape({
  proposerName: string().optional(),
  productName: string().optional(),
  search: string().optional(),
  fromDate: date().optional(),
  toDate: date().optional(),
});

export const DoctorAssignRequest = object().shape({
  casesIds: array()
    .of(string().required())
    .min(1, "At least one proposerId is required")
    .required(),
});
export const assignParamIdRequest = object().shape({
  id: string().required(),
});
export const hangupCallRequest = object().shape({
  callId: string().required(),
});
export const addRemarkRequest = object().shape({
  remark: string().required(),
});
export const submitAssignedCasesRequest = object().shape({
  alternateMobileNo: string().optional(),
  language: string().optional(),
  callbackDate: string().optional(),
  dispositionId: string().optional(),
});
