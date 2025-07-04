// import React from "react";
// import { WebView } from "react-native-webview";
// import { useLocalSearchParams, router } from "expo-router";
// import { useToast } from "@/context/ToastContext";
// import bookingApi from "@/services/tour";
// import moment from "moment";

// export default function VNPayScreen() {
//   const {
//     paymentUrl,
//     bookingId,
//     paymentId,
//     customerId,
//   } = useLocalSearchParams<{
//     paymentUrl: string;
//     bookingId?: string;
//     paymentId?: string;
//     customerId?: string;
//   }>();
//   const { showToast } = useToast();

//   // if (!paymentUrl || !bookingId || !paymentId || !customerId) {
//   //   console.error(
//   //     JSON.stringify(
//   //       {
//   //         error: "Thiếu tham số cần thiết",
//   //         data: { paymentUrl, bookingId, paymentId, customerId },
//   //       },
//   //       null,
//   //       2
//   //     )
//   //   );
//   //   showToast({
//   //     type: "error",
//   //     message: "Thiếu thông tin thanh toán. Vui lòng thử lại.",
//   //   });
//   //   router.back();
//   //   return null;
//   // }

//   console.log(
//     JSON.stringify({ paymentUrl, bookingId, paymentId, customerId }, null, 2)
//   );

//   const handlePaymentUpdate = async (params: Record<string, string>) => {
//     try {
//       const amountPaid = Number(params.vnp_Amount) / 100;
//       const parsedPaymentId = Number(paymentId);
//       const status = params.vnp_ResponseCode === "00" ? 2 : 4; 
//       const paidDate = moment(
//         params.vnp_PayDate,
//         "YYYYMMDDHHmmss"
//       ).toISOString(); // Định dạng lại paidDate
//       const transactionNo = params.vnp_TransactionNo;
//       const messageError =
//         params.vnp_ResponseCode !== "00"
//           ? `Mã lỗi: ${params.vnp_ResponseCode}`
//           : "";

//       const response = await bookingApi.statusBooking(
//         parsedPaymentId,
//         status,
//         paidDate,
//         transactionNo,
//         messageError
//       );
//       console.log(
//         JSON.stringify(
//           { action: "Cập nhật trạng thái thanh toán", data: response },
//           null,
//           2
//         )
//       );
//       return response;
//     } catch (error) {
//       // console.error(
//       //   JSON.stringify(
//       //     {
//       //       error: "Lỗi khi cập nhật trạng thái thanh toán",
//       //       message: (error as any)?.message || error,
//       //     },
//       //     null,
//       //     2
//       //   )
//       // );
//       showToast({
//         type: "error",
//         message:
//           "Lỗi khi cập nhật trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.",
//       });
//       return null;
//     }
//   };

//   return (
//     <WebView
//       source={{ uri: paymentUrl }}
//       onNavigationStateChange={async (navState) => {
//         console.log(
//           JSON.stringify(
//             { action: "Đang điều hướng", url: navState.url },
//             null,
//             2
//           )
//         );
//         if (navState.url.includes("vnp_ResponseCode")) {
//           console.log(
//             JSON.stringify(
//               { action: "Phát hiện URL callback VNPay", url: navState.url },
//               null,
//               2
//             )
//           );
//           try {
//             const url = new URL(navState.url);
//             const params = Object.fromEntries(url.searchParams.entries());
//             console.log(
//               JSON.stringify(
//                 { action: "Tham số callback VNPay", data: params },
//                 null,
//                 2
//               )
//             );
//             const paidAmount = Number(params.vnp_Amount) / 100;

//             if (params.vnp_ResponseCode === "00") {
//               await handlePaymentUpdate(params);
//               showToast({
//                 type: "success",
//                 message: "Thanh toán thành công!",
//               });
//               router.push({
//                 pathname: "/(screens)/booking/successBooking",
//                 params: {
//                   ...params,
//                   bookingId,
//                   customerId,
//                   amountPaid: paidAmount.toString(),
//                 },
//               });
//             } else {
//               await handlePaymentUpdate(params);
//               showToast({
//                 type: "error",
//                 message: `Thanh toán thất bại. Mã lỗi: ${params.vnp_ResponseCode}`,
//               });
//               router.push({
//                 pathname: "/(screens)/payment/FailureScreen",
//                 params,
//               });
//             }
//             return false;
//           } catch (error) {
//             console.error(
//               JSON.stringify(
//                 {
//                   error: "Lỗi khi phân tích URL callback",
//                   message: (error as any)?.message || error,
//                 },
//                 null,
//                 2
//               )
//             );
//             showToast({
//               type: "error",
//               message: "Lỗi khi xử lý kết quả thanh toán.",
//             });
//             router.push("/(screens)/payment/FailureScreen");
//             return false;
//           }
//         }
//         if (navState.url.includes("/Payment/Error.html")) {
//           const urlParams = new URL(navState.url).searchParams;
//           const errorCode = urlParams.get("code");
//           console.error(
//             JSON.stringify({ error: "Lỗi VNPay", code: errorCode }, null, 2)
//           );
//           showToast({
//             type: "error",
//             message: `Lỗi thanh toán VNPay. Mã lỗi: ${errorCode ||
//               "Không xác định"}`,
//           });
//           router.push("/(screens)/payment/FailureScreen");
//           return false;
//         }
//         return true;
//       }}
//       onError={(syntheticEvent) => {
//         const { nativeEvent } = syntheticEvent;
//         console.error(
//           JSON.stringify({ error: "Lỗi WebView", data: nativeEvent }, null, 2)
//         );
//         showToast({
//           type: "error",
//           message: "Lỗi khi tải trang thanh toán. Vui lòng thử lại.",
//         });
//         router.back();
//       }}
//     />
//   );
// }
