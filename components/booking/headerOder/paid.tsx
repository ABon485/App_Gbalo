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
        console.log("[TourPaid] Retrieved data from AsyncStorage:", storedData);

        if (!storedData) {
          console.warn("[TourPaid] No auth data found in AsyncStorage.");
          router.push("/(auths)/(Login)/loginEmail");
          return;
        }

        const authData = JSON.parse(storedData);
        const parsedUserId = Number(authData.userId);

        if (isNaN(parsedUserId)) {
          console.warn(
            "[TourPaid] Invalid userId format in authData:",
            authData.userId
          );
          router.push("/(auths)/(Login)/loginEmail");
          return;
        }

        setUserId(parsedUserId);
        console.log(`[TourPaid] Set userId to ${parsedUserId}`);

        const response = await bookingApi.getBooking(parsedUserId, 1, 10);
        console.log("[TourPaid] API response for paid bookings:", {
          userId: parsedUserId,
          totalBookings: response?.data?.datas?.length || 0,
          paidBookings: response?.data?.datas
            ?.filter((item: BookingItem) => item.amountPaid > 0)
            .map((b: BookingItem) => ({
              id: b.id,
              serviceName: b.serviceName,
              amountPaid: b.amountPaid,
              amountRemaining: b.amountRemaining,
              totalAmount: b.totalAmount,
              departureDate: b.departureDate,
            })),
          rawResponse: JSON.stringify(response?.data, null, 2),
        });

        const paidTours = (response?.data?.datas || []).filter(
          (item: BookingItem) => item.amountPaid > 0
        );
        setTours(paidTours);
      } catch (error) {
        console.error("[TourPaid] Failed to fetch paid bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidBookings();
  }, [router]);

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
              <Text style={styles.tourPrice}>
                Trạng thái:{" "}
                {tour.amountRemaining === 0
                  ? "Đã thanh toán toàn bộ"
                  : `Đã đặt cọc ${formatCurrency(tour.amountPaid)}`}
              </Text>

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
