// import React from "react";
// import { View, Text, ActivityIndicator } from "react-native";
// import { WebView } from "react-native-webview";
// import { useLocalSearchParams, router } from "expo-router";
// import { useToast } from "@/context/ToastContext";
// import tourApi from "@/services/tour"; 

// export default function PaymentScreen() {
//   const { paymentUrl, bookingId } = useLocalSearchParams();
//   const { showToast } = useToast();

//   if (!paymentUrl || !bookingId) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text style={{ fontSize: 18, color: "#333" }}>
//           Lỗi: Không tìm thấy thông tin thanh toán.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <WebView
//       source={{ uri: paymentUrl as string }}
//       style={{ flex: 1 }}
//       startInLoadingState={true}
//       renderLoading={() => (
//         <View
//           style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//         >
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       )}
//       onNavigationStateChange={async (navState) => {
//         if (navState.url.includes("yourdomain.com/payment/callback")) {
//           try {
//             const result = await tourApi.getPaymentResult(bookingId as string);

//             if (
//               result.status === "Success" &&
//               result.data.transactionStatus === "00"
//             ) {
//               showToast({
//                 type: "success",
//                 message: "Thanh toán thành công!",
//               });
//               router.push({
//                 pathname: "/(screens)/booking/successBooking",
//                 params: { bookingId: bookingId as string },
//               });
//             } else {
//               showToast({
//                 type: "error",
//                 message: "Thanh toán thất bại. Vui lòng thử lại.",
//               });
//               router.push({
//                 pathname: "/(screens)/payment/FailureScreen",
//                 params: { message: "Thanh toán thất bại" },
//               });
//             }
//           } catch (error) {
//             console.error("Error checking VnPayResult:", {
//               message: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error),
//               response: typeof error === "object" && error !== null && "response" in error ? (error as any).response?.data : undefined,
//             });
//             showToast({
//               type: "error",
//               message: "Lỗi khi kiểm tra kết quả thanh toán.",
//             });
//             router.push({
//               pathname: "/(screens)/payment/FailureScreen",
//               params: { message: "Lỗi khi kiểm tra kết quả thanh toán" },
//             });
//           }
//         }
//       }}
//       onError={(syntheticEvent) => {
//         const { nativeEvent } = syntheticEvent;
//         console.error("WebView error:", nativeEvent);
//         showToast({
//           type: "error",
//           message: "Lỗi khi tải trang thanh toán.",
//         });
//         router.push({
//           pathname: "/(screens)/payment/FailureScreen",
//           params: { message: "Lỗi khi tải trang thanh toán" },
//         });
//       }}
//     />
//   );
// }
