import { object, string } from "yup";
export const hdfcDumpCasesRequest = object({
    xlsxFileKey: string().required(),
});
