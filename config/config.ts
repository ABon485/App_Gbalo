export interface VNPayConfig {
  TMN_CODE: string;
  HASH_SECRET: string;
  BASE_URL: string;
  RETURN_URL: string;
}

export const VNPAY_CONFIG: VNPayConfig = {
  TMN_CODE: "UCM9AHLN",
  HASH_SECRET: "URLKGYO76SHTGDZPJ1S0T1ZO732ZQS8O",
  BASE_URL: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  RETURN_URL: "http://localhost:19006/payment/callback", // URL Web cho Expo
  // Hoặc dùng một endpoint backend: "https://your-backend.com/callback"
};