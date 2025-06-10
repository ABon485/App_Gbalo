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

const TourPending = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        console.log(
          "fetchPendingBookings: Retrieved data from AsyncStorage:",
          storedData
        );

        if (storedData) {
          const authData = JSON.parse(storedData);
          const parsedUserId = Number(authData.userId);

          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log(`fetchPendingBookings: Set userId to ${parsedUserId}`);

            console.log(
              `fetchPendingBookings: Calling API for userId=${parsedUserId}, page=1, pageSize=10`
            );
            const response = await bookingApi.getBooking(parsedUserId, 1, 10);
            const pendingTours = (response.data.datas || []).filter(
              (item: BookingItem) => item.amountRemaining > 0
            );

            // console.log(
            //   `fetchPendingBookings: API response for userId=${parsedUserId}:`,
            //   {
            //     totalBookings: response.data.datas?.length || 0,
            //     pendingBookingCount: pendingTours.length,
            //     pendingBookings: pendingTours.map((b: BookingItem) => ({
            //       id: b.id,
            //       serviceName: b.serviceName,
            //       bookingStatus: b.bookingStatus,
            //       totalAmount: b.totalAmount,
            //       amountRemaining: b.amountRemaining,
            //     })),
            //   }
            // );

            setTours(pendingTours);
          } else {
            console.warn(
              "fetchPendingBookings: Invalid userId format in authData:",
              authData.userId
            );
          }
        } else {
          console.warn(
            "fetchPendingBookings: No auth data found in AsyncStorage. Redirecting to login."
          );
          router.push("/(auths)/(Login)/loginEmail");
        }
      } catch (error) {
        console.error(
          "fetchPendingBookings: Failed to fetch pending bookings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

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
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
});

export default TourPending;
