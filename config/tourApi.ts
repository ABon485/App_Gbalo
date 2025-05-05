// config/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '@/types/api';

const NEXT_PUBLIC_API_TOUR_BASE_URL = process.env.NEXT_PUBLIC_API_TOUR_BASE_URL || 'https://api-tour.vbalo.com';
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.vbalo.com';

// Create first instance: apiTour
const apiTour: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_TOUR_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create second instance: api
const api: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common request interceptor (for both)
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const data = await AsyncStorage.getItem('data');
  const parsedData = data ? JSON.parse(data) : null;

  if (parsedData?.token) {
    config.headers.Authorization = `Bearer ${parsedData.token}`;
  }

  return config;
};

// Common response interceptor (for both)
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

// Attach interceptors to both instances
apiTour.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
apiTour.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// Export cả 2 instance
export { apiTour, api };
