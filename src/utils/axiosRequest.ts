// utils/axiosRequest.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface AxiosRequestParams extends AxiosRequestConfig {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
}

export const axiosRequest = async <T = any>(options: AxiosRequestParams): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method: options.method,
      url: options.url,
      headers: options.headers,
      data: options.data,
      params: options.params,
    });
    return response.data;
  } catch (error: any) {
    // Optional: customize error logging or throw structured error
    console.error('Axios request failed:', error?.response?.data || error.message);
    throw error;
  }
};
