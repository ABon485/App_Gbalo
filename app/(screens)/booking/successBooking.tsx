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
  const totalPrice = Number(params.totalPrice) || 0;
  const imageUrl = params.imageUrl as string;
  const tourName = params.tourName as string;
  const tourSubName = params.tourSubName as string; // Retrieve tourSubName from params

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
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("@/assets/images/home/Property1.png")
          }
          style={styles.tourImage}
          onError={() => {
            console.log("Failed to load image from URL:", imageUrl);
          }}
        />
        <View style={styles.tourInfo}>
          <Text style={styles.tourTitle}>
            {tourName}
          </Text>
          <Text style={styles.tourDesc}>
            {tourSubName}
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
