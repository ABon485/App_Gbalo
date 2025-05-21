import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router, useLocalSearchParams } from "expo-router";
import styles from "@/styles/booking/successBooking";
import Feather from "@expo/vector-icons/Feather";

export default function SuccessBooking() {
  const params = useLocalSearchParams();
  const selectedDate = params.selectedDate as string;
  const selectedGuests = params.selectedGuests as string;
  const totalPrice = Number(params.totalPrice) || 0;
  const imageUrl = params.imageUrl as string;
  const tourName = params.tourName as string;
  const tourSubName = params.tourSubName as string;
  const userInfo = params.userInfo
    ? JSON.parse(params.userInfo as string)
    : null; // Parse userInfo từ params
  const prepaid = Math.round(totalPrice * 0.3);
  const remaining = totalPrice - prepaid;

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
          <Text style={styles.tourTitle}>{tourName}</Text>
          <Text style={styles.tourDesc}>{tourSubName}</Text>
          <Text style={styles.rating}>⭐ 4.95/5 (648)</Text>
          <Text style={styles.price}>
            Từ: {totalPrice.toLocaleString("vi-VN")}₫/Người
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
        <Feather name="users" size={16} color="black" />
        <Text style={styles.guestText}>
          {selectedGuests || "2 người lớn, trẻ em và 1 em bé"}
        </Text>
      </View>

      {/* Tour Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết Tour</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mã đặt Tour:</Text>
          <Text style={styles.detailValue}>#TOUR2025DN</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khởi hành từ:</Text>
          <Text style={styles.detailValue}>Hà Nội</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khách hàng:</Text>
          <Text style={styles.detailValue}>
            {userInfo?.fullName || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số điện thoại:</Text>
          <Text style={styles.detailValue}>
            {userInfo?.phone || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>
            {userInfo?.email || "Chưa cung cấp"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tổng giá Tour:</Text>
          <Text style={styles.detailPrice}>
            {totalPrice.toLocaleString("vi-VN")} vnd
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Đã thanh toán 30%:</Text>
          <Text style={styles.detailPrice}>
            {prepaid.toLocaleString("vi-VN")} vnd
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số tiền còn lại:</Text>
          <Text style={styles.detailPriceBold}>
            {remaining.toLocaleString("vi-VN")} vnd
          </Text>
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
