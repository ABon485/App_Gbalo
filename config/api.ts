// config/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lấy base URL từ biến môi trường (nếu có) hoặc hardcode
const API_BASE_URL = 'https://api-acc.vbalo.com'; 

// Tạo instance của Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý request trước khi gửi
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Danh sách các route không cần token
    const authRoutes = ['/login', '/register'];

    // Lấy dữ liệu từ AsyncStorage thay vì localStorage
    const data = await AsyncStorage.getItem('data');
    const parsedData = data ? JSON.parse(data) : null;

    // Thêm token vào header nếu không phải route auth
    if (parsedData?.token && config.url && !authRoutes.includes(config.url)) {
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return {
      ...response,
      success: true,
      data: response.data,
      message: response.data.message || 'Success',
    };
  },
  (error) => {
    return Promise.reject({
      success: false,
      data: null,
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status || 500,
    });
  }
);

export default api;