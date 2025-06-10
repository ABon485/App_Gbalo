import { useLocalSearchParams, router } from "expo-router";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";
import * as Linking from "expo-linking";

export default function PaymentCallback() {
  const { showToast } = useToast();

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      console.log("handleUrl được gọi với:", url);
      if (
        url &&
        typeof url === "string" &&
        url.startsWith("myapp://payment/callback")
      ) {
        try {
          console.log("Phát hiện deep link myapp://payment/callback");
          const urlObj = new URL(url);
          const params = Object.fromEntries(urlObj.searchParams.entries());
          console.log("Tham số callback VNPay:", params);

          if (params.vnp_ResponseCode === "00") {
            showToast({
              type: "success",
              message: "Thanh toán thành công!",
            });
            router.push({
              pathname: "/(screens)/booking/successBooking",
              params,
            });
          } else {
            showToast({
              type: "error",
              message: `Thanh toán thất bại. Mã lỗi: ${params.vnp_ResponseCode}`,
            });
            router.push({
              pathname: "/(screens)/payment/FailureScreen",
              params,
            });
          }
        } catch (err) {
          console.error("Lỗi khi phân tích deep link:", err);
          showToast({
            type: "error",
            message: "Lỗi khi xử lý thanh toán. Vui lòng thử lại.",
          });
          router.back();
        }
      } else {
        console.log("URL không phải deep link myapp://", url);
      }
    };

    console.log("PaymentCallback: Đăng ký listener cho deep link");
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link URL received:", url);
      handleUrl(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("App opened with URL:", url);
        handleUrl(url);
      } else {
        console.log("Không có URL ban đầu từ Linking.getInitialURL");
      }
    });

    return () => {
      console.log("PaymentCallback: Hủy listener deep link");
      subscription.remove();
    };
  }, []);

  return null;
}
