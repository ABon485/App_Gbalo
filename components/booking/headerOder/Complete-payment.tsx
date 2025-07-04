import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { BookingItem } from "@/types/tour";
import bookingApi from "@/services/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TourComplete = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        console.log(
          "[TourComplete] Retrieved data from AsyncStorage:",
          storedData
        );

        if (storedData) {
          const authData = JSON.parse(storedData);
          const parsedUserId = Number(authData.userId);

          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log(`[TourComplete] Set userId to ${parsedUserId}`);

            const response = await bookingApi.getBooking(parsedUserId, 1, 10);
            console.log("[TourComplete] API response for completed bookings:", {
              userId: parsedUserId,
              totalBookings: response.data.datas?.length || 0,
              completedBookings: response.data.datas
                ?.filter(
                  (item: BookingItem) =>
                    item.bookingStatus === 3 || item.bookingStatus === 4
                )
                .map((b: BookingItem) => ({
                  id: b.id,
                  serviceName: b.serviceName,
                  bookingStatus: b.bookingStatus,
                  totalAmount: b.totalAmount,
                  departureDate: b.departureDate,
                })),
              rawResponse: JSON.stringify(response.data, null, 2),
            });

            const completedTours = (response.data.datas || []).filter(
              (item: BookingItem) =>
                item.bookingStatus === 3 || item.bookingStatus === 4
            );
            setTours(completedTours);
          } else {
            console.warn(
              "[TourComplete] Invalid userId format in authData:",
              authData.userId
            );
            router.push("/(auths)/(Login)/loginEmail");
          }
        } else {
          console.warn(
            "[TourComplete] No auth data found in AsyncStorage. Redirecting to login."
          );
          router.push("/(auths)/(Login)/loginEmail");
        }
      } catch (error) {
        console.error(
          "[TourComplete] Failed to fetch completed bookings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedBookings();
  }, [router]);

  const handleReviewPress = (tour: BookingItem) => {
    router.push({
      pathname: "/(screens)/rating/ReviewPage",
      params: {
        tourId: tour.id.toString(),
        tourName: tour.serviceName,
        tourImage: tour.serviceImageUrl || "",
        departureDate: tour.departureDate,
        totalAmount: tour.totalAmount.toString(),
        status: tour.bookingStatus === 3 ? "Hoàn thành" : "Đã hoàn thành",
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const getStatusText = (item: BookingItem) => {
    if (item.bookingStatus === 3) {
      return { prefix: "Trạng thái:", status: "Hoàn thành" };
    } else if (item.bookingStatus === 4) {
      return { prefix: "Trạng thái:", status: "Đã hoàn thành" };
    }
    return { prefix: "Trạng thái:", status: "Hoàn thành" }; // Fallback, should not occur
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
            Bạn chưa có đơn hàng hoàn thành
          </Text>
        </View>
      )}
      {tours.length > 0 && (
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
                  Ngày khởi hành:{" "}
                  {new Date(tour.departureDate).toLocaleDateString("vi-VN")}
                </Text>
                {(() => {
                  const status = getStatusText(tour);
                  return (
                    <Text style={styles.tourPrice}>
                      {status.prefix}{" "}
                      <Text style={{ color: "#666" }}>{status.status}</Text>
                    </Text>
                  );
                })()}
                <Text style={styles.tourTotal}>
                  Tổng tiền:{" "}
                  <Text style={{ color: "#ff6600", fontWeight: "bold" }}>
                    {formatCurrency(tour.totalAmount)}
                  </Text>
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button1}>
                    <Text style={styles.buttonText1}>Đặt lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleReviewPress(tour)}
                  >
                    <Text style={styles.buttonText2}>Viết đánh giá</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    borderBottomColor: "#ddd",
  },
  tourImage: {
    width: 130,
    height: 150,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
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
    color: "#666",
    marginTop: 4,
  },
  tourPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  tourTotal: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  button1: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#ff4500",
  },
  button2: {
    backgroundColor: "#ff6600",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  buttonText1: {
    color: "#ff4500",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonText2: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: -149,
    padding: 20,
  },
  noOrderImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  noOrderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default TourComplete;
