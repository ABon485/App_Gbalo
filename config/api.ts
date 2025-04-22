import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiResponse } from '@/types/api' // Import kiểu ApiResponse

const API_BASE_URL = 'https://api-acc.vbalo.com'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authRoutes = ['/Login', '/LoginByEmail', '/LoginByPhone', '/Accounts/Resgiter']
    const data = await AsyncStorage.getItem('data')
    const parsedData = data ? JSON.parse(data) : null

    if (parsedData?.token && config.url && !authRoutes.includes(config.url)) {
      config.headers.Authorization = `Bearer ${parsedData.token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Gắn thêm các field phụ để dễ dùng ở nơi khác
    (response as AxiosResponse & ApiResponse).success = true
    ;(response as AxiosResponse & ApiResponse).message = response.data?.message || 'Success'
    return response
  },
  (error) => {
    return Promise.reject({
      success: false,
      data: null,
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status || 500,
    } as ApiResponse)
  }
)

export default api
