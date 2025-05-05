import { object, string } from "yup";

export const UploadRequest = object({
    folder: string().optional(),
});
export const UploadKeyQueryRequest = object({
    file: string().required(),
});