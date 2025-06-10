import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { ApiResponse } from "@/types/api";

const NEXT_PUBLIC_API_TOUR_BASE_URL =
  process.env.NEXT_PUBLIC_API_TOUR_BASE_URL || "https://api-tour.vbalo.com";
const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.vbalo.com";
const VNPAY_BASE_URL = "http://192.168.1.200:5360";
const VNPAY_SECRET_KEY =
  process.env.VNPAY_SECRET_KEY || "YOUR_VNPAY_SECRET_KEY";

// Create instance: apiTour
const apiTour: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_TOUR_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create instance: api
const api: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create instance: apiVNPay
const apiVNPay: AxiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Hàm tạo vnp_SecureHash
const createVNPaySecureHash = (
  params: Record<string, any>,
  secretKey: string = VNPAY_SECRET_KEY
): string => {
  const signData = Object.keys(params)
    .sort()
    .map(
      (key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`
    )
    .join("&");

  return CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
};

// Request interceptor (cho api và apiTour)
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const data = await AsyncStorage.getItem("data");
  const parsedData = data ? JSON.parse(data) : null;

  if (
    parsedData?.token &&
    !config.url?.includes("/vnpay") &&
    !config.url?.includes("/VnPayResult")
  ) {
    config.headers.Authorization = `Bearer ${parsedData.token}`;
  }

  return config;
};

// Response interceptor (cho api và apiTour)
const responseInterceptor = (response: AxiosResponse) => {
  // Xử lý riêng cho VNPay response
  if (response.config.url?.includes("/VnPayResult")) {
    return response.data; // Trả về response gốc từ VNPay
  }
  (response as AxiosResponse & ApiResponse).success = true;
  (response as AxiosResponse & ApiResponse).message =
    response.data?.message || "Success";
  return response;
};

// Response error interceptor
const responseErrorInterceptor = (error: any) => {
  return Promise.reject({
    success: false,
    data: null,
    message: error.response?.data?.message || "Something went wrong",
    status: error.response?.status || 500,
  } as ApiResponse);
};

// Attach interceptors to api and apiTour
apiTour.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
apiTour.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);
api.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// Attach interceptors to apiVNPay (không cần Authorization)
apiVNPay.interceptors.response.use(
  (response) => response.data, // Trả về response.data trực tiếp
  responseErrorInterceptor
);

// Hàm mẫu để gọi /vnpay/create-link
export const createVNPayLink = async (params: {
  Amount: number;
  ClientIp: string;
  OrderInfo: string;
  OrderType: string;
  ReturnUrl: string;
  ExpireDate: string;
}) => {
  const vnpParams: {
    vnp_Version: string;
    vnp_Command: string;
    vnp_TmnCode: string;
    vnp_Amount: number;
    vnp_CurrCode: string;
    vnp_TxnRef: string;
    vnp_OrderInfo: string;
    vnp_OrderType: string;
    vnp_Locale: string;
    vnp_ReturnUrl: string;
    vnp_IpAddr: string;
    vnp_CreateDate: string;
    vnp_ExpireDate: string;
    vnp_SecureHash?: string;
  } = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: "UCM9AHLN", // Lấy từ .env hoặc cấu hình
    vnp_Amount: params.Amount * 100, // VNPay yêu cầu Amount tính bằng VND * 100
    vnp_CurrCode: "VND",
    vnp_TxnRef: `TXN_${Date.now()}`,
    vnp_OrderInfo: params.OrderInfo,
    vnp_OrderType: params.OrderType,
    vnp_Locale: "vn",
    vnp_ReturnUrl: params.ReturnUrl,
    vnp_IpAddr: params.ClientIp,
    vnp_CreateDate: new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14),
    vnp_ExpireDate: params.ExpireDate.replace(/[-:T.]/g, "").slice(0, 14),
  };

  // vnpParams.vnp_SecureHash = createVNPaySecureHash(vnpParams);

  const response = await apiVNPay.post("/vnpay/create-link", null, {
    params: vnpParams,
  });

  return response;
};

// Export instances
export { apiTour, api, apiVNPay };
