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

const TourPaid = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPaidBookings = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        console.log(
          "fetchPaidBookings: Retrieved data from AsyncStorage:",
          storedData
        );

        if (storedData) {
          const authData = JSON.parse(storedData);
          const parsedUserId = Number(authData.userId);

          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log(`fetchPaidBookings: Set userId to ${parsedUserId}`);

            console.log(
              `fetchPaidBookings: Calling API for userId=${parsedUserId}, page=1, pageSize=10`
            );
            const response = await bookingApi.getBooking(parsedUserId, 1, 10);
            const paidTours = (response.data.datas || []).filter(
              (item: BookingItem) => item.amountRemaining === 0
            );

            console.log(
              `fetchPaidBookings: API response for userId=${parsedUserId}:`,
              {
                totalBookings: response.data.datas?.length || 0,
                paidBookingCount: paidTours.length,
                paidBookings: paidTours.map((b: BookingItem) => ({
                  id: b.id,
                  serviceName: b.serviceName,
                  bookingStatus: b.bookingStatus,
                  totalAmount: b.totalAmount,
                  amountRemaining: b.amountRemaining,
                })),
              }
            );

            setTours(paidTours);
          } else {
            console.warn(
              "fetchPaidBookings: Invalid userId format in authData:",
              authData.userId
            );
          }
        } else {
          console.warn(
            "fetchPaidBookings: No auth data found in AsyncStorage. Redirecting to login."
          );
          router.push("/(auths)/(Login)/loginEmail");
        }
      } catch (error) {
        console.error(
          "fetchPaidBookings: Failed to fetch paid bookings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaidBookings();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
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
            Bạn chưa có đơn hàng đã thanh toán
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
              <Text style={styles.tourPrice}>Trạng thái: Đã thanh toán</Text>
              <Text style={styles.tourTotal}>
                Tổng số:{" "}
                <Text style={styles.orangeText}>
                  {formatCurrency(tour.totalAmount)}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(screens)/tourOder/oderDetail")}
              >
                <Text style={styles.tourBalance}>Hiển thị chi tiết</Text>
              </TouchableOpacity>
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
  tourBalance: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
    textDecorationLine: "underline",
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

export default TourPaid;
