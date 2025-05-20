import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useLocalSearchParams } from "expo-router";
import styles from "@/styles/booking/successBooking";

export default function SuccessBooking() {
  const params = useLocalSearchParams();
  const selectedDate = params.selectedDate as string;
  const selectedGuests = params.selectedGuests as string;
  const totalPrice = Number(params.totalPrice) || 0; // Retrieve totalPrice from params

  return (
    <View style={styles.container}>
      {/* Success Message */}
      <View style={styles.successHeader}>
        <AntDesign name="checkcircle" size={24} color="#4CAF50" />
        <Text style={styles.successText}>Bạn đã đặt tour thành công</Text>
      </View>

      {/* Booking Title */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>Đặt Tour của bạn</Text>
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
            uri: "https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2024/1/26/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912-37-0-587-880-crop-1706239860681642023140.jpg",
          }}
          style={styles.tourImage}
        />
        <View style={styles.tourInfo}>
          <Text style={styles.tourTitle}>
            Tour sớm đến đồi BaNaHILL/Cầu vàng
          </Text>
          <Text style={styles.tourDesc}>
            Tour sớm Bà Nà Hills/Cầu Vàng – săn mây, tận hưởng không khí trong
            lành
          </Text>
          <Text style={styles.rating}>⭐ 4.95/5 (648)</Text>
          <Text style={styles.price}>
            Tổng giá: {totalPrice.toLocaleString("vi-VN")}₫
          </Text>
        </View>
      </View>

      {/* Date and Guest Info */}
      <View style={styles.dateGuestContainer}>
        <AntDesign
          name="calendar"
          size={16}
          color="#000"
          style={styles.calendarIcon}
        />
        <Text style={styles.dateText}>
          {selectedDate || "Thứ 3, 01/04/2025"}
        </Text>
      </View>
      {/* Guest Info with Border */}
      <View style={styles.guestTextContainer}>
        <Text style={styles.guestText}>
          {selectedGuests || "2 người lớn, trẻ em và 1 em bé"}
        </Text>
      </View>

      {/* Tour Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết đặt Tour</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mã đặt Tour:</Text>
          <Text style={styles.detailValue}>NNSG-44H3-3RHD</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời gian:</Text>
          <Text style={styles.detailValue}>3N2D Từ ngày 07/03/2025</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khởi hành từ:</Text>
          <Text style={styles.detailValue}>Hà Nội Vào lúc 09:20</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
          <Text style={styles.detailValue}>VN Pay</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tổng cộng:</Text>
          <Text style={styles.detailValuePrice}>
            {totalPrice.toLocaleString("vi-VN")}₫
          </Text>
        </View>
      </View>

      {/* Explore More Button */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.back()}
      >
        <Text style={styles.exploreButtonText}>
          Khám phá các khách sạn hấp dẫn
        </Text>
      </TouchableOpacity>
    </View>
  );
}
