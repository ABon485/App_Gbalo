// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";
// // import styles from "@/styles/booking/failure";

// export default function FailureScreen() {
//   const { message } = useLocalSearchParams();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>
//         {message || "Thanh toán thất bại. Vui lòng thử lại."}
//       </Text>
//       <TouchableOpacity
//         style={{ padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}
//         onPress={() => router.push("/(screens)/booking/confirmBooking")}
//       >
//         <Text style={{ color: "#fff", fontSize: 16 }}>Thử lại</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }