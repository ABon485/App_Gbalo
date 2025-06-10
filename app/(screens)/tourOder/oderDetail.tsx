import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import bookingApi from "@/services/tour";
import { BookingResponse } from "@/types/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tourApi from "@/services/tour";

const TourDetailScreen = () => {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadUserIdAndFetchBooking = async () => {
      try {
        const storedData = await AsyncStorage.getItem("data");
        if (!storedData) {
          setError("Vui lòng đăng nhập để xem chi tiết booking.");
          setLoading(false);
          return;
        }

        const authData = JSON.parse(storedData);
        const parsedUserId = Number(authData.userId);
        if (isNaN(parsedUserId)) {
          setError("Dữ liệu người dùng không hợp lệ.");
          setLoading(false);
          return;
        }
        setUserId(parsedUserId);

        if (!bookingId) {
          setError("Không tìm thấy thông tin đơn hàng.");
          setLoading(false);
          return;
        }

        const parsedBookingId = Number(bookingId);
        if (isNaN(parsedBookingId)) {
          setError("ID đơn hàng không hợp lệ.");
          setLoading(false);
          return;
        }

        const response = await bookingApi.getBookingById(
          parsedBookingId,
          parsedUserId
        );
        if (!response.data || !response.data.bookingCode) {
          throw new Error("Dữ liệu booking không đầy đủ.");
        }
        console.log("fetchBookingDetails: Booking Data:", JSON.stringify(response?.data, null, 2));
        setBookingData(response);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin đặt tour. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    loadUserIdAndFetchBooking();
  }, [bookingId]);

  const getStatusText = (item: BookingResponse["data"]) => {
    if (item.amountRemaining > 0 && item.pendingPaymentCreated) {
      const timeRemaining = new Date(
        item.pendingPaymentCreated
      ).toLocaleTimeString("vi-VN");
      return { prefix: "Đang chờ thanh toán", time: timeRemaining };
    }
    if (item.bookingStatus === 3) {
      return { prefix: "Đã hoàn thành", time: null };
    }
    if (item.bookingStatus === 4) {
      return { prefix: "Đã hoàn tiền", time: null };
    }
    return { prefix: item.bookingStatusName || "Không rõ", time: null };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error || !bookingData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>
          {error || "Không có thông tin đặt tour."}
        </Text>
        {error?.includes("đăng nhập") && (
          <TouchableOpacity
            onPress={() => router.push("/(auths)/(Login)/loginEmail")}
          >
            <Text style={{ color: "#007AFF", marginTop: 10 }}>
              Đi đến đăng nhập
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const { data } = bookingData;
  const service = data.services?.[0] || {};
  const totalGuests =
    service.details?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) ||
    0;
  const status = getStatusText(data);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionHeader}>Chi tiết Tour</Text>
        <View style={styles.tourCard}>
          <Image
            source={{
              uri: service.serviceImageUrl || "https://via.placeholder.com/150",
            }}
            style={styles.tourImage}
          />
          <View style={styles.tourInfo}>
            <Text style={styles.tourTitle}>
              {service.serviceName || "Tên tour không xác định"}
            </Text>
            <Text style={styles.tourDate}>
              Ngày khởi hành:{" "}
              {data.departureDate
                ? new Date(data.departureDate).toLocaleDateString("vi-VN")
                : "Chưa xác định"}
            </Text>
            {service.details?.map((detail, index) => (
              <View style={styles.priceSection} key={index}>
                <Text style={styles.priceRow}>{detail.serviceDetaiName}</Text>
                <Text style={styles.priceValue1}>
                  {detail.quantity} x {detail.price?.toLocaleString("vi-VN")}{" "}
                  vnd
                </Text>
              </View>
            ))}
            <View style={styles.priceSection}>
              <Text style={styles.priceRow}>Mã đơn hàng</Text>
              <Text style={styles.priceValue2}>
                {data.bookingCode || "Chưa xác định"}
              </Text>
            </View>
            <Text style={styles.totalPrice}>
              <Text style={{ color: "black"}}>
                Tổng tiền:{" "}
              </Text>
              <Text style={{ color: "#ff6600", fontWeight: "600" }}>
                {data.totalAmount?.toLocaleString("vi-VN") || "0"} đ
              </Text>
            </Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                Trạng thái: {status.prefix}
                {status.time && ( 
                  <>
                    {" "}
                    <Text style={{ color: "#ff6600" }}>{status.time}</Text>
                  </>
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên lạc</Text>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Họ và tên:</Text>
            <Text style={styles.contactValue}>
              {data.customerName || "Chưa cung cấp"}
            </Text>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>
              {data.customerEmail || "Chưa cung cấp"}
            </Text>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Số điện thoại:</Text>
            <Text style={styles.contactValue}>
              {data.customerPhone || "Chưa cung cấp"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bao gồm</Text>
          {service.details?.map((detail, index) => (
            <Text key={index} style={styles.bulletPoint}>
              • {data.note || "Thông tin không có sẵn"}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý & Chính sách:</Text>
          <Text style={styles.bulletPoint}>
            • Mang theo CMND/CCCD hoặc hộ chiếu để xác nhận danh tính
          </Text>
          <Text style={styles.bulletPoint}>
            • Đến đúng giờ tại điểm hẹn để không bị lỡ lịch trình
          </Text>
          <Text style={styles.bulletPoint}>
            • Chính sách hủy tour: Hủy trước 3 ngày hoàn 50%
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ nhanh</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => router.replace("/(tabs)/assistant")}
          >
            <Text style={styles.supportText}>Trò chuyện với Gbalo</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TourDetailScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tourCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tourImage: {
    width: 120,
    height: 160,
    borderRadius: 6,
    marginRight: 10,
  },
  tourInfo: {
    flex: 1,
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    lineHeight: 18,
  },
  tourDate: {
    fontSize: 13,
    color: "#000000",
    marginBottom: 6,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  priceRow: {
    fontSize: 13,
    color: "black",
  },
  priceValue1: {
    fontSize: 13,
    color: "black",
  },
   priceValue2: {
    fontSize: 13,
    color: "#00809D",
  },
  totalPrice: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  statusText: {
    fontSize: 13,
    color: "black",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  contactSection: {
    flexDirection: "row",
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  contactValue: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supportText: {
    fontSize: 14,
    color: "#007AFF",
    flex: 1,
  },
});
