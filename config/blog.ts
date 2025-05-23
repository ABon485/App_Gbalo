import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '@/types/api';

const NEXT_PUBLIC_API_BLOG_URL = process.env.NEXT_PUBLIC_API_BLOG_URL || 'http://api-blog.vbalo.com';

const apiBlog: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BLOG_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const data = await AsyncStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;

  if (parsedData?.token) {
    config.headers.Authorization = `Bearer ${parsedData.token}`;
  }

  return config;
};

const responseInterceptor = (response: AxiosResponse) => {
  (response as AxiosResponse & ApiResponse).success = true;
  (response as AxiosResponse & ApiResponse).message = response.data?.message || 'Success';
  return response;
};

const responseErrorInterceptor = (error: any) => {
  return Promise.reject({
    success: false,
    data: null,
    message: error.response?.data?.message || 'Something went wrong',
    status: error.response?.status || 500,
  } as ApiResponse);
};

apiBlog.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
apiBlog.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export { apiBlog };
