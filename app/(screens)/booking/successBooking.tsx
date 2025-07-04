import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import styles from "@/styles/booking/successBooking";
import bookingApi from "@/services/tour";
import { BookingResponse } from "@/types/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SuccessBooking() {
  const { bookingId, customerId, amountPaid } = useLocalSearchParams<{
    bookingId?: string;
    customerId?: string;
    amountPaid?: string;
  }>();
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      let effectiveBookingId = bookingId;
      let effectiveCustomerId = customerId;

      if (!effectiveBookingId || !effectiveCustomerId) {
        const lastBookingId = await AsyncStorage.getItem("lastBookingId");
        effectiveBookingId =
          effectiveBookingId || (lastBookingId !== null ? lastBookingId : undefined);
        const lastCustomerId = await AsyncStorage.getItem("lastCustomerId");
        effectiveCustomerId =
          effectiveCustomerId || (lastCustomerId !== null ? lastCustomerId : undefined);
        console.log(
          JSON.stringify(
            {
              action: "Fallback bookingId",
              data: { effectiveBookingId, effectiveCustomerId },
            },
            null,
            2
          )
        );
      }

      if (!effectiveBookingId || !effectiveCustomerId) {
        setError("Thiếu thông tin booking hoặc khách hàng.");
        setLoading(false);
        return;
      }

      try {
        const response = await bookingApi.getBookingById(
          Number(effectiveBookingId),
          Number(effectiveCustomerId)
        );
        console.log(
          JSON.stringify(
            { action: "Booking Details", data: response.data },
            null,
            2
          )
        );
        setBookingData(response);
        setLoading(false);
      } catch (err) {
        console.error(
          JSON.stringify(
            {
              error: "Lỗi khi lấy chi tiết booking",
              message: (err as any)?.message || err,
            },
            null,
            2
          )
        );
        setError("Không thể tải thông tin đặt tour. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, customerId]);

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
        <Text style={styles.errorText}>
          {error || "Không tìm thấy thông tin đặt tour."}
        </Text>
      </View>
    );
  }

  const { data } = bookingData;
  const service = data.services?.[0] || {};

  // Calculate total number of guests from all service details
  const totalGuests =
    service.details?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) ||
    0;

  // Sử dụng amountPaid từ callback nếu data.amountPaid chưa cập nhật
  const effectiveAmountPaid =
    data.amountPaid || (amountPaid ? Number(amountPaid) : 0);
  const effectiveAmountRemaining =
    data.amountRemaining !== undefined
      ? data.amountRemaining
      : (data.totalAmount || 0) - effectiveAmountPaid;

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
          source={{
            uri: service.serviceImageUrl || "https://via.placeholder.com/150",
          }}
          style={styles.tourImage}
        />
        <View style={styles.tourInfo}>
          <Text style={styles.tourTitle}>
            {service.serviceName || "Tên tour không xác định"}
          </Text>
          <Text style={styles.tourDesc}>Khám phá điểm đến</Text>
          <Text style={styles.rating}>
            <AntDesign name="star" size={16} color="#F24E1E" />{" "}
            {data.rating || "Chưa đánh giá"}
          </Text>
          <Text style={styles.price}>
            Từ{" "}
            <Text style={styles.bold}>
              {data.totalAmount?.toLocaleString("vi-VN") || "0"}₫
            </Text>
            /Người
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
          <Text style={styles.detailValue}>
            {data.bookingCode || "Chưa xác định"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khởi hành từ:</Text>
          <Text style={styles.detailValue}>
            {data.services?.[0]?.departureProvince || "Chưa xác định"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khách hàng:</Text>
          <Text style={styles.detailValue}>
            {data.customerName || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số điện thoại:</Text>
          <Text style={styles.detailValue}>
            {data.customerPhone || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>
            {data.customerEmail || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tổng giá Tour:</Text>
          <Text style={styles.detailPrice}>
            {data.totalAmount?.toLocaleString("vi-VN") || "0"} vnd
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Đã thanh toán:</Text>
          <Text style={styles.detailPrice}>
            {effectiveAmountPaid.toLocaleString("vi-VN")} vnd
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số tiền còn lại:</Text>
          <Text style={styles.detailPriceBold}>
            {effectiveAmountRemaining.toLocaleString("vi-VN")} vnd
          </Text>
        </View>

        {/* Payment Status */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Trạng thái thanh toán:</Text>
          <Text style={styles.detailValue}>
            {effectiveAmountRemaining === 0
              ? "Đã thanh toán toàn bộ"
              : `Còn lại ${effectiveAmountRemaining.toLocaleString(
                  "vi-VN"
                )} vnd`}
          </Text>
        </View>
      </View>

      {/* Explore More Button */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => {
          if (effectiveAmountRemaining === 0) {
            router.replace("/"); // Navigate to TourPaid if fully paid
          } else {
            router.replace("/homepage"); // Otherwise, go to homepage
          }
        }}
      >
        <Text style={styles.exploreButtonText}>
          {effectiveAmountRemaining === 0
            ? "Xem các tour đã thanh toán"
            : "Khám phá các Tours hấp dẫn"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
