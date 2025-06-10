import React from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { VNPAY_CONFIG } from "@/config/config";
import { useToast } from "@/context/ToastContext";

export default function VNPayScreen() {
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>();
  const { showToast } = useToast();

  if (!paymentUrl) {
    console.error("Lỗi: Không nhận được paymentUrl");
    showToast({
      type: "error",
      message: "Không nhận được đường dẫn thanh toán. Vui lòng thử lại.",
    });
    router.back();
    return null;
  }
  console.log("paymentUrl:", paymentUrl);

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={(navState) => {
        console.log("Đang điều hướng đến:", navState.url);
        if (navState.url.includes(VNPAY_CONFIG.RETURN_URL)) {
          console.log("Phát hiện URL callback VNPay:", navState.url);
          try {
            const url = new URL(navState.url);
            const urlParams = url.searchParams;
            const params = Object.fromEntries(urlParams);
            console.log("Tham số callback VNPay:", params);
            console.log(
              "Đang điều hướng đến tuyến đường callback với tham số:",
              params
            );

            // Navigate to the callback route
            router.push({
              pathname: "/(screens)/payment/callback",
              params,
            });
            return false; // Prevent WebView from loading the deep link
          } catch (error) {
            console.error("Lỗi khi phân tích URL callback:", error);
            showToast({
              type: "error",
              message: "Lỗi khi xử lý kết quả thanh toán.",
            });
            router.push("/(screens)/payment/FailureScreen");
            return false;
          }
        }
        if (navState.url.includes("/Payment/Error.html")) {
          const urlParams = new URL(navState.url).searchParams;
          const errorCode = urlParams.get("code");
          console.error("Lỗi VNPay:", errorCode);
          showToast({
            type: "error",
            message: `Lỗi thanh toán VNPay. Mã lỗi: ${errorCode}`,
          });
          router.push("/(screens)/payment/FailureScreen");
          return false;
        }
        return true;
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error("Lỗi WebView:", nativeEvent);
        showToast({
          type: "error",
          message: "Lỗi khi tải trang thanh toán. Vui lòng thử lại.",
        });
        router.back();
      }}
    />
  );
}
