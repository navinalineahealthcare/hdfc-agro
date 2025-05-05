// utils/responseWrapper.ts

import { COMMON_MESSAGE } from "./constants";

type ResponseWrapperOptions<T = any> = {
  success: boolean;
  message: string;
  status?: number;
  data?: T;
  error?: any;
  [key: string]: any;
};

export default function responseWrapper<T = any>(
  p0: boolean,
  Error: COMMON_MESSAGE,
  p1: number,
  options: ResponseWrapperOptions<T>
) {
  const {
    success,
    message,
    status = success ? 200 : 500,
    data = null,
    error = null,
    ...rest
  } = options;

  return {
    success,
    message,
    status,
    data,
    error,
    ...rest,
  };
}

//   Example Usage

// const response = responseWrapper({
//     success: true,
//     message: "Data fetched successfully",
//     data: { users: [] },
//     pagination: { page: 1, limit: 10 },
//   });
