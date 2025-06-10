import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { BookingItem } from "@/types/tour";
import bookingApi from "@/services/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TourListScreen = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchBookings = async (pageToLoad = 1) => {
    if (!userId) {
      console.log("fetchBookings: No userId available, skipping API call.");
      return;
    }
    setLoading(true);
    try {
      console.log(
        `fetchBookings: Calling API for userId=${userId}, page=${pageToLoad}, pageSize=10`
      );
      const response = await bookingApi.getBooking(userId, pageToLoad, 10);
      const newBookings = response.data.datas || [];

      if (pageToLoad === 1) {
        setTours(newBookings);
      } else {
        setTours((prev) => [...prev, ...newBookings]);
      }

      setHasMore(newBookings.length === 10);
    } catch (error) {
      console.error(
        `fetchBookings: Failed to fetch bookings for userId=${userId}:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        if (storedData) {
          const authData = JSON.parse(storedData);
          const parsedUserId = Number(authData.userId);
          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log(`loadUserId: Set userId to ${parsedUserId}`);
          } else {
            console.warn(
              "loadUserId: Invalid userId format in authData:",
              authData.userId
            );
          }
        } else {
          console.warn(
            "loadUserId: No data found in AsyncStorage. Redirecting to login."
          );
          router.push("/(auths)/(Login)/loginEmail");
        }
      } catch (error) {
        console.error("loadUserId: Error reading AsyncStorage:", error);
      }
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      console.log(
        `useEffect: userId changed to ${userId}, fetching bookings for page 1`
      );
      setPage(1);
      fetchBookings(1);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        console.log(
          `handleLoadMore: Loading more bookings for page ${nextPage}`
        );
        fetchBookings(nextPage);
        return nextPage;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const getStatusText = (item: BookingItem) => {
    if (item.amountRemaining > 0) {
      const timeRemaining = new Date(
        item.pendingPaymentCreated
      ).toLocaleTimeString("vi-VN");
      return { prefix: "Trạng thái: Đang chờ thanh toán", time: timeRemaining };
    }
    if (item.bookingStatus === 3) {
      return { prefix: "Trạng thái: Đã hoàn thành", time: null };
    }
    return { prefix: "Trạng thái: Đã thanh toán", time: null };
  };

  const getButtonText = (item: BookingItem) => {
    if (item.amountRemaining > 0) {
      return "Thanh toán";
    }
    if (item.bookingStatus === 3) {
      return "Đặt lại";
    }
    return null;
  };

  const getCancelText = (item: BookingItem) => {
    if (item.bookingStatus === 3) {
      return "Xem đơn hàng";
    }
    return null;
  };

  if (loading && page === 1) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tours.length === 0 && userId && (
        <View style={styles.noOrderContainer}>
          <Image
            source={require("@/assets/images/orderNull.png")}
            style={styles.noOrderImage}
          />
          <Text style={styles.noOrderText}>Bạn chưa có đơn hàng nào</Text>
        </View>
      )}
      <ScrollView
        style={styles.listContainer}
        onMomentumScrollEnd={(e) => {
          const {
            contentOffset,
            layoutMeasurement,
            contentSize,
          } = e.nativeEvent;
          if (
            contentOffset.y + layoutMeasurement.height >=
            contentSize.height - 20
          ) {
            handleLoadMore();
          }
        }}
      >
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
                {getButtonText(tour) && (
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{getButtonText(tour)}</Text>
                  </TouchableOpacity>
                )}
                {getCancelText(tour) && (
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>
                      {getCancelText(tour)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
        {loading && page > 1 && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text>Loading more...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
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
  cancelButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
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

export default TourListScreen;
