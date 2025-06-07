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

  const handleNavigation = (navState: any) => {
    console.log(
      "handleNavigation được gọi với navState:",
      JSON.stringify(navState)
    );
    const url = navState?.url;
    if (!url || typeof url !== "string") {
      console.warn("URL không hợp lệ trong navState:", navState);
      return true;
    }

    console.log("Đang điều hướng đến:", url);

    try {
      if (url.startsWith("myapp://payment/callback")) {
        console.log("Phát hiện deep link myapp://payment/callback");
        const urlObj = new URL(url);
        const params = Object.fromEntries(urlObj.searchParams.entries());
        console.log("Tham số callback VNPay:", params);

        router.push({
          pathname: "/(screens)/payment/callback",
          params,
        });
        console.log("Chặn URL và chuyển hướng qua router.push");
        return false;
      }

      if (
        url.includes("/Payment/Error.html") ||
        url.includes("/paymentv2/Transaction/Error.html")
      ) {
        console.log("Phát hiện trang lỗi VNPay");
        const urlParams = new URL(url).searchParams;
        const errorCode = urlParams.get("code");

        showToast({
          type: "error",
          message: `Thanh toán thất bại. Vui lòng liên hệ VNPay: 1900 55 55 77. Mã tra cứu: ${errorCode ||
            "Không có mã tra cứu"}`,
        });

        router.push({
          pathname: "/(screens)/payment/FailureScreen",
          params: { errorCode: errorCode || "unknown" },
        });
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi phân tích URL trong try-catch:", err);
      showToast({
        type: "error",
        message: "Lỗi khi xử lý URL thanh toán. Vui lòng thử lại.",
      });
      router.back();
      return false;
    }

    console.log("Cho phép điều hướng URL:", url);
    return true;
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onShouldStartLoadWithRequest={(request) => {
        console.log(
          "onShouldStartLoadWithRequest called with URL:",
          request.url
        );
        if (request.url && typeof request.url === "string") {
          if (request.url.startsWith("myapp://")) {
            console.log("Chặn URL myapp:// trong onShouldStartLoadWithRequest");
            handleNavigation({ url: request.url });
            return false;
          }
          if (
            request.url.includes("/Payment/Error.html") ||
            request.url.includes("/paymentv2/Transaction/Error.html")
          ) {
            console.log("Phát hiện trang lỗi VNPay");
            const urlParams = new URL(request.url).searchParams;
            const errorCode = urlParams.get("code");
            showToast({
              type: "error",
              message: `Thanh toán thất bại. Vui lòng liên hệ VNPay: 1900 55 55 77. Mã tra cứu: ${errorCode ||
                "Không có mã tra cứu"}`,
            });
            router.push({
              pathname: "/(screens)/payment/FailureScreen",
              params: { errorCode: errorCode || "unknown" },
            });
            return false;
          }
        }
        console.log("Cho phép load URL trong WebView:", request.url);
        return true;
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error("Lỗi WebView:", JSON.stringify(nativeEvent));
        showToast({
          type: "error",
          message: "Lỗi khi tải trang thanh toán. Vui lòng thử lại.",
        });
        router.back();
      }}
      injectedJavaScript={`
    (function() {
      console.log("Injected JS: Bắt đầu giám sát URL");
      window.addEventListener('load', function() {
        console.log("WebView: Trang đã tải, URL ban đầu:", window.location.href);
        window.ReactNativeWebView.postMessage(window.location.href);
        var originalLocation = window.location.href;
        setInterval(function() {
          if (window.location.href !== originalLocation) {
            console.log("WebView: URL thay đổi thành", window.location.href);
            window.ReactNativeWebView.postMessage(window.location.href);
            originalLocation = window.location.href;
          }
        }, 50);
      });
    })();
  `}
      onMessage={(event) => {
        const url = event.nativeEvent?.data;
        console.log("Received URL from WebView:", url);
        if (url && typeof url === "string") {
          if (url.startsWith("myapp://")) {
            console.log("Xử lý URL myapp:// từ onMessage");
            handleNavigation({ url });
          } else {
            console.log("URL từ WebView (không phải deep link):", url);
          }
        } else {
          console.warn("Dữ liệu từ onMessage không phải chuỗi:", url);
        }
      }}
    />
  );
}
