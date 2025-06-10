import CryptoJS from "crypto-js";
import queryString from "query-string";
import moment from "moment-timezone";
import { VNPAY_CONFIG } from "@/config/config";

interface VNPayParams {
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
}

export const createVNPayUrl = (
  orderId: string,
  amount: number,
  orderInfo: string = "Thanh toan don hang",
  clientIp: string
): string => {
  const vnp_TxnRef = `${orderId}_${Date.now()}`.substring(0, 37);

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  const vnp_Amount = Math.round(amount * 100);

  const createDate = moment().tz("Asia/Ho_Chi_Minh");
  const vnp_CreateDate = createDate.format("YYYYMMDDHHmmss");
  const vnp_ExpireDate = moment(createDate)
    .add(15, "minutes")
    .format("YYYYMMDDHHmmss");

  const cleanOrderInfo = orderInfo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 255);

  const vnp_Params: VNPayParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
    vnp_Amount: vnp_Amount,
    vnp_CurrCode: "VND",
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: cleanOrderInfo,
    vnp_OrderType: "travel",
    vnp_Locale: "vn",
    vnp_ReturnUrl: VNPAY_CONFIG.RETURN_URL,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: vnp_CreateDate,
    vnp_ExpireDate: vnp_ExpireDate,
  };

  // Sort parameters alphabetically
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((obj: { [key: string]: string | number }, key) => {
      obj[key] = vnp_Params[key as keyof VNPayParams];
      return obj;
    }, {});

  // Stringify parameters with proper encoding (spaces as '+')
  const signData = queryString.stringify(sortedParams, {
    encode: true,
    sort: false, // Sorting is already done above
    arrayFormat: "none", // Ensure no array formatting issues
  }).replace(/%20/g, "+");

  // Calculate secure hash
  const secureHash = CryptoJS.HmacSHA512(
    signData,
    VNPAY_CONFIG.HASH_SECRET
  ).toString(CryptoJS.enc.Hex);

  // Construct final URL
  const fullUrl = `${VNPAY_CONFIG.BASE_URL}?${signData}&vnp_SecureHash=${secureHash}`;

  console.log("VNPay Params:", vnp_Params);
  console.log("Sign Data:", signData);
  console.log("Secure Hash:", secureHash);
  console.log("Generated VNPay URL:", fullUrl);
  return fullUrl;
};