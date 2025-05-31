import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import styles from "@/styles/booking/successBooking";
import bookingApi from "@/services/tour";
import { BookingResponse } from "@/types/tour";

export default function SuccessBooking() {
  const { bookingId } = useLocalSearchParams();
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Không tìm thấy mã đặt tour.");
        setLoading(false);
        return;
      }

      try {
        const response = await bookingApi.getBookingById(Number(bookingId));
        if (!response.data || !response.data.bookingCode) {
          throw new Error("Dữ liệu booking không đầy đủ.");
        }
        setBookingData(response);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết booking:", err);
        setError("Không thể tải thông tin đặt tour. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin đặt tour...</Text>
      </View>
    );
  }

  if (error || !bookingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || "Không tìm thấy thông tin đặt tour."}</Text>
      </View>
    );
  }

  const { data } = bookingData;
  const service = data.services?.[0] || {};

  // Calculate total number of guests from all service details
  const totalGuests = service.details?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) || 0;

  return (
    <View style={styles.container}>
      {/* Success Message */}
      <View style={styles.successHeader}>
        <AntDesign name="checkcircle" size={24} color="#4CAF50" />
        <Text style={styles.successText}>Bạn đã đặt tour thành công</Text>
      </View>

      {/* Booking Title */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>Thông tin Tour của bạn</Text>
        <View style={styles.iconRow}>
          <FontAwesome6 name="share-from-square" size={20} color="black" />
          <AntDesign
            name="download"
            size={20}
            color="#000"
            style={styles.iconMargin}
          />
        </View>
      </View>

      {/* Tour Info */}
      <View style={styles.tourCard}>
        <Image
          source={{ uri: service.serviceImageUrl || "https://via.placeholder.com/150" }}
          style={styles.tourImage}
        />
        <View style={styles.tourInfo}>
          <Text style={styles.tourTitle}>{service.serviceName || "Tên tour không xác định"}</Text>
          <Text style={styles.tourDesc}>Khám phá điểm đến</Text>
          <Text style={styles.rating}>
            <AntDesign name="star" size={16} color="#F24E1E" /> 4.95/5 (648)
          </Text>
          <Text style={styles.price}>
            Từ <Text style={styles.bold}>{data.totalAmount?.toLocaleString("vi-VN") || "0"}₫</Text>/Người
          </Text>
        </View>
      </View>

      {/* Date and Guest Info */}
      <View style={styles.dateGuestContainer}>
        <AntDesign name="calendar" size={16} color="#666" style={styles.icon} />
        <View>
          <Text style={styles.labelText}>Ngày khởi hành</Text>
          <Text style={styles.valueText}>
            {data.departureDate
              ? new Date(data.departureDate).toLocaleDateString("vi-VN")
              : "Chưa xác định"}
          </Text>
        </View>
      </View>

      <View style={styles.dateGuestContainer}>
        <Feather name="users" size={16} color="#666" style={styles.icon} />
        <View>
          <Text style={styles.labelText}>Khách</Text>
          <Text style={styles.valueText}>
            {totalGuests > 0 ? `${totalGuests} khách` : "Chưa xác định"}
          </Text>
        </View>
      </View>

      {/* Tour Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết Tour</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mã đặt Tour:</Text>
          <Text style={styles.detailValue}>{data.bookingCode || "Chưa xác định"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khởi hành từ:</Text>
          <Text style={styles.detailValue}>Hà Nội</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khách hàng:</Text>
          <Text style={styles.detailValue}>{data.customerName || "Chưa cung cấp"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số điện thoại:</Text>
          <Text style={styles.detailValue}>{data.customerPhone || "Chưa cung cấp"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{data.customerEmail || "Chưa cung cấp"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tổng giá Tour:</Text>
          <Text style={styles.detailPrice}>{data.totalAmount?.toLocaleString("vi-VN") || "0"} vnd</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Đã thanh toán:</Text>
          <Text style={styles.detailPrice}>{data.amountPaid?.toLocaleString("vi-VN") || "0"} vnd</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số tiền còn lại:</Text>
          <Text style={styles.detailPriceBold}>{data.amountRemaining?.toLocaleString("vi-VN") || "0"} vnd</Text>
        </View>
      </View>

      {/* Explore More Button */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.replace("/homepage")}
      >
        <Text style={styles.exploreButtonText}>Khám phá các Tours hấp dẫn</Text>
      </TouchableOpacity>
    </View>
  );
}