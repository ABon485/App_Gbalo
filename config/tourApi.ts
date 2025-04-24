// config/apiTour.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '@/types/api';

const NEXT_PUBLIC_API_TOUR_BASE_URL='https://api-tour.vbalo.com' ; // Fallback URL nếu env không được thiết lập

const apiTour: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_TOUR_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiTour.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const data = await AsyncStorage.getItem('data');
    const parsedData = data ? JSON.parse(data) : null;

    if (parsedData?.token) {
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiTour.interceptors.response.use(
  (response: AxiosResponse) => {
    (response as AxiosResponse & ApiResponse).success = true;
    (response as AxiosResponse & ApiResponse).message = response.data?.message || 'Success';
    return response;
  },
  (error) => {
    return Promise.reject({
      success: false,
      data: null,
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status || 500,
    } as ApiResponse);
  }
);

export default apiTour;