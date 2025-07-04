// import { useLocalSearchParams, router } from "expo-router";
// import { useToast } from "@/context/ToastContext";
// import { useEffect } from "react";
// import * as Linking from "expo-linking";
// import bookingApi from "@/services/tour";
// import moment from "moment";

// export default function PaymentCallback() {
//   const { showToast } = useToast();
//   const { bookingId, paymentId, customerId } = useLocalSearchParams<{
//     bookingId?: string;
//     paymentId?: string;
//     customerId?: string;
//   }>();

//   const handlePaymentUpdate = async (params: Record<string, string>) => {
//     try {
//       const parsedPaymentId = Number(paymentId);
//       const status = params.vnp_ResponseCode === "00" ? 2 : 4;
//       const paidDate = moment(
//         params.vnp_PayDate,
//         "YYYYMMDDHHmmss"
//       ).toISOString();
//       const transactionNo = params.vnp_TransactionNo;
//       const amountPaid = Number(params.vnp_Amount) / 100; 
//       const messageError =
//         params.vnp_ResponseCode !== "00"
//           ? `Mã lỗi: ${params.vnp_ResponseCode}`
//           : "";

//       // ✅ Gửi thêm amountPaid vào API
//       const response = await bookingApi.statusBooking(
//         parsedPaymentId,
//         status,
//         paidDate,
//         transactionNo,
//         messageError,
//         amountPaid
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
//       showToast({
//         type: "error",
//         message: "Lỗi khi cập nhật trạng thái thanh toán.",
//       });
//       return null;
//     }
//   };

//   useEffect(() => {
//     const handleUrl = async (url: string | null) => {
//       console.log(
//         JSON.stringify({ action: "handleUrl được gọi", url }, null, 2)
//       );

//       if (url && url.includes("vnp_ResponseCode")) {
//         try {
//           console.log(
//             JSON.stringify({ action: "Phát hiện callback", url }, null, 2)
//           );
//           const urlObj = new URL(url);
//           const params = Object.fromEntries(urlObj.searchParams.entries());
//           const amountPaid = Number(params.vnp_Amount) / 100;

//           console.log(
//             JSON.stringify(
//               { action: "Tham số callback", data: params },
//               null,
//               2
//             )
//           );

//           await handlePaymentUpdate(params);

//           if (
//             params.vnp_ResponseCode === "00" &&
//             bookingId &&
//             paymentId &&
//             customerId
//           ) {
//             showToast({
//               type: "success",
//               message: "Thanh toán thành công!",
//             });
//             router.push({
//               pathname: "/(screens)/booking/successBooking",
//               params: {
//                 ...params,
//                 bookingId,
//                 customerId,
//                 amountPaid: amountPaid.toString(),
//               },
//             });
//           } else {
//             showToast({
//               type: "error",
//               message: `Thanh toán thất bại. Mã lỗi: ${params.vnp_ResponseCode}`,
//             });
//             router.push({
//               pathname: "/(screens)/payment/FailureScreen",
//               params,
//             });
//           }
//         } catch (err) {
//           showToast({
//             type: "error",
//             message: "Lỗi khi xử lý thanh toán. Vui lòng thử lại.",
//           });
//           router.back();
//         }
//       } else {
//         console.log(
//           JSON.stringify({ warning: "Không phải callback VNPay", url }, null, 2)
//         );
//       }
//     };

//     Linking.getInitialURL().then((url) => {
//       console.log(JSON.stringify({ action: "Initial URL", url }, null, 2));
//       handleUrl(url);
//     });

//     const subscription = Linking.addEventListener("url", ({ url }) => {
//       console.log(
//         JSON.stringify({ action: "Deep link URL received", url }, null, 2)
//       );
//       handleUrl(url);
//     });

//     return () => subscription.remove();
//   }, [showToast, bookingId, paymentId, customerId]);

//   return null;
// }
