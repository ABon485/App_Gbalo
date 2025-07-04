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
  clientIp: string,
  returnUrl: string = VNPAY_CONFIG.RETURN_URL // Thêm tham số returnUrl
): string => {
  // Validate inputs
  if (!orderId || orderId.trim() === "") {
    throw new Error("orderId is required and cannot be empty");
  }
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (!clientIp || clientIp.trim() === "") {
    throw new Error("clientIp is required");
  }
  if (!returnUrl || returnUrl.trim() === "") {
    throw new Error("returnUrl is required");
  }

  // Ensure TxnRef is unique and not too long
  const vnp_TxnRef = `BOOKING_${orderId}_${Date.now()}`.substring(0, 37);

  // Calculate amount for VNPay (in cents)
  const vnp_Amount = Math.round(amount * 100);

  // Generate create and expire dates
  const createDate = moment().tz("Asia/Ho_Chi_Minh");
  const vnp_CreateDate = createDate.format("YYYYMMDDHHmmss");
  const vnp_ExpireDate = createDate.add(15, "minutes").format("YYYYMMDDHHmmss");

  // Clean orderInfo to ensure compatibility
  const cleanOrderInfo = orderInfo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 255);

  // Construct VNPay parameters
  const vnp_Params: VNPayParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNPAY_CONFIG.TMN_CODE || "UCM9AHLN",
    vnp_Amount: vnp_Amount,
    vnp_CurrCode: "VND",
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: cleanOrderInfo,
    vnp_OrderType: "travel",
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
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

  // Stringify parameters with proper encoding
  const signData = queryString
    .stringify(sortedParams, {
      encode: true,
      sort: false,
      arrayFormat: "none",
    })
    .replace(/%20/g, "+");

  // Calculate secure hash
  const secretKey = VNPAY_CONFIG.HASH_SECRET || "YOUR_VNPAY_SECRET_KEY";
  const secureHash = CryptoJS.HmacSHA512(signData, secretKey).toString(
    CryptoJS.enc.Hex
  );

  // Construct final URL
  const baseUrl =
    VNPAY_CONFIG.BASE_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const fullUrl = `${baseUrl}?${signData}&vnp_SecureHash=${secureHash}`;

  console.log(
    JSON.stringify(
      {
        action: "Generated VNPay URL",
        data: { vnp_Params, signData, secureHash, fullUrl },
      },
      null,
      2
    )
  );

  return fullUrl;
};
