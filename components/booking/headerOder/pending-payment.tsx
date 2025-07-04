import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview"; // Thêm WebView
import { BookingItem } from "@/types/tour";
import bookingApi from "@/services/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext"; // Thêm ToastContext nếu cần

const TourPending = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null); // Thêm trạng thái paymentUrl
  const [modalVisible, setModalVisible] = useState(false); // Thêm trạng thái modalVisible
  const { showToast } = useToast(); // Thêm useToast nếu cần thông báo

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        console.log(
          "[TourPending] Retrieved data from AsyncStorage:",
          storedData
        );

        if (storedData) {
          const authData = JSON.parse(storedData);
          const parsedUserId = Number(authData.userId);

          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log(`[TourPending] Set userId to ${parsedUserId}`);

            const response = await bookingApi.getBooking(parsedUserId, 1, 10);
            console.log("[TourPending] API response for pending bookings:", {
              userId: parsedUserId,
              totalBookings: response.data.datas?.length || 0,
              pendingBookings: response.data.datas
                ?.filter((item: BookingItem) => item.amountRemaining > 0)
                .map((b: BookingItem) => ({
                  id: b.id,
                  serviceName: b.serviceName,
                  amountRemaining: b.amountRemaining,
                  totalAmount: b.totalAmount,
                  departureDate: b.departureDate,
                  pendingPaymentCreated: b.pendingPaymentCreated,
                })),
              rawResponse: JSON.stringify(response.data, null, 2),
            });

            const pendingTours = (response.data.datas || []).filter(
              (item: BookingItem) => item.amountRemaining > 0
            );
            setTours(pendingTours);
          } else {
            console.warn(
              "[TourPending] Invalid userId format in authData:",
              authData.userId
            );
            router.push("/(auths)/(Login)/loginEmail");
          }
        } else {
          console.warn(
            "[TourPending] No auth data found in AsyncStorage. Redirecting to login."
          );
          router.push("/(auths)/(Login)/loginEmail");
        }
      } catch (error) {
        console.error("[TourPending] Failed to fetch pending bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, [router]);

  const handleReBooking = async (bookingId: number) => {
    try {
      const response = await bookingApi.ReBooking(bookingId);
      console.log("ReBooking success:", response);

      if (response?.data?.paymentRedirectUrl) {
        // Lưu bookingId vào AsyncStorage để sử dụng sau khi thanh toán
        await AsyncStorage.setItem("lastBookingId", bookingId.toString());
        await AsyncStorage.setItem("lastCustomerId", userId?.toString() || "");

        // Cập nhật paymentUrl và mở modal
        setPaymentUrl(response.data.paymentRedirectUrl);
        setModalVisible(true);
      } else {
        showToast({
          type: "error",
          message: "Không tìm thấy URL thanh toán!",
        });
      }
    } catch (error) {
      console.error("ReBooking error:", error);
      showToast({
        type: "error",
        message: "Có lỗi xảy ra khi tạo thanh toán lại.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const getStatusText = (item: BookingItem) => {
    const timeRemaining = new Date(
      item.pendingPaymentCreated
    ).toLocaleTimeString("vi-VN");
    return { prefix: "Trạng thái: Đang chờ thanh toán", time: timeRemaining };
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.noOrderText}>
          Vui lòng đăng nhập để xem danh sách booking.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auths)/(Login)/loginEmail")}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>
            Đi đến đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tours.length === 0 && (
        <View style={styles.noOrderContainer}>
          <Image
            source={require("@/assets/images/orderNull.png")}
            style={styles.noOrderImage}
          />
          <Text style={styles.noOrderText}>
            Bạn chưa có đơn hàng đang chờ thanh toán
          </Text>
        </View>
      )}
      <ScrollView style={styles.listContainer}>
        {tours.map((tour) => (
          <View key={tour.id} style={styles.tourItem}>
            <Image
              source={
                tour.serviceImageUrl
                  ? { uri: tour.serviceImageUrl }
                  : require("@/assets/images/BackGroud.png")
              }
              style={styles.tourImage}
            />
            <View style={styles.tourDetails}>
              <Text style={styles.tourTitle}>{tour.serviceName}</Text>
              <Text style={styles.tourDate}>
                {new Date(tour.departureDate).toLocaleDateString("vi-VN")}
              </Text>
              {(() => {
                const status = getStatusText(tour);
                return (
                  <Text style={styles.tourPrice}>
                    {status.prefix}
                    {status.time && (
                      <>
                        {" "}
                        <Text style={{ color: "#ff6600" }}>{status.time}</Text>
                      </>
                    )}
                  </Text>
                );
              })()}
              <Text style={styles.tourTotal}>
                Tổng số:{" "}
                <Text style={styles.orangeText}>
                  {formatCurrency(tour.totalAmount)}
                </Text>
              </Text>
              <View style={styles.bottomRow}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(screens)/tourOder/oderDetail",
                      params: { bookingId: tour.id.toString() },
                    })
                  }
                >
                  <Text style={styles.tourBalance}>Hiển thị chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleReBooking(tour.id)}
                >
                  <Text style={styles.buttonText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal hiển thị VNPay */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setModalVisible(false);
          showToast({
            type: "info",
            message: "Bạn đã hủy thanh toán.",
          });
        }}
      >
        <View style={styles.fullScreenContainer}>
          <WebView
            source={{ uri: paymentUrl || "" }}
            style={styles.fullScreenWebView}
            onNavigationStateChange={async (event) => {
              console.log("WebView navigation:", event.url);
              if (event.url.includes("finit")) {
                setPaymentUrl(null);
                setModalVisible(false);

                const lastBookingId = await AsyncStorage.getItem(
                  "lastBookingId"
                );
                const lastCustomerId = await AsyncStorage.getItem(
                  "lastCustomerId"
                );

                if (lastBookingId && lastCustomerId) {
                  router.push({
                    pathname: "/(screens)/booking/successBooking",
                    params: {
                      bookingId: lastBookingId,
                      customerId: lastCustomerId,
                      amountPaid:
                        tours
                          .find((tour) => tour.id === Number(lastBookingId))
                          ?.amountRemaining?.toString() || "0",
                    },
                  });
                } else {
                  showToast({
                    type: "error",
                    message:
                      "Không thể xác định thông tin booking. Vui lòng thử lại.",
                  });
                }
              } else if (
                event.url.includes("vnp_TransactionStatus=02") ||
                event.url.includes("vnp_TransactionStatus=01") ||
                event.url.includes("cancel") ||
                event.url.includes("error") ||
                event.url.includes("vnpayresult") ||
                event.url.includes("vnp_ResponseCode=24") // Thêm mã hủy của VNPay
              ) {
                // Hủy tour hoặc không thanh toán thành công
                setPaymentUrl(null);
                setModalVisible(false);
                showToast({
                  type: "info",
                  message: event.url.includes("vnp_TransactionStatus=02")
                    ? "Bạn đã hủy thanh toán."
                    : "Thanh toán không thành công. Vui lòng thử lại.",
                });
                router.push("/(screens)/booking/confirmBooking"); // Chuyển về trang Confirm
              }
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  tourItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  tourImage: {
    width: 120,
    height: 150,
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 5,
  },
  tourDetails: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  tourDate: {
    fontSize: 14,
    marginTop: 4,
  },
  tourPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  tourTotal: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  orangeText: {
    color: "#ff6600",
    fontWeight: "bold",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  tourBalance: {
    fontSize: 14,
    textDecorationLine: "underline",
    color: "gray",
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noOrderImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  noOrderText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullScreenWebView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default TourPending;
