import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useRouter } from "expo-router";
import Modal from "react-native-modal";

const notifications = [
  {
    id: "1",
    title: "Chương trình du lịch Hè 2025",
    description:
      "Chúng tôi xin thông báo về chương trình du lịch hè 2025 dành cho toàn thể nhân viên công ty...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/example.png"),
  },
  {
    id: "2",
    title: "Chương trình du lịch Nha Trang",
    description:
      "Chúng tôi rất vui mừng thông báo chương trình ưu đãi đặc biệt dành cho chuyến du lịch đến Nha Trang...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/notification2.png"),
  },
  {
    id: "3",
    title: "Chương trình du lịch Hạ Long",
    description:
      "Chúng tôi xin thông báo về chương trình du lịch hè 2025 dành cho toàn thể nhân viên công ty...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/example.png"),
  },
  {
    id: "4",
    title: "Chương trình du lịch Đà Lạt",
    description:
      "Chúng tôi xin thông báo về chương trình du lịch hè 2025 dành cho toàn thể nhân viên công ty...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/notification2.png"),
  },
  {
    id: "5",
    title: "Chương trình ưu đãi du lịch Hè 2025",
    description:
      "Chúng tôi rất vui mừng thông báo về chương trình ưu đãi đặc biệt dành cho chuyến đi hè năm 2025...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/example.png"),
  },
  {
    id: "6",
    title: "🎉 Ưu Đãi Đặc Biệt Dành Cho Bạn! 🎉",
    description:
      "Chúng tôi hân hạnh thông báo chương trình ưu đãi đặc biệt với nhiều phần quà giá trị...",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/notification2.png"),
  },
  {
    id: "7",
    title: "🧳 Khuyến Mãi Du Lịch Cuối Năm! 🧳",
    description:
      "Chào mừng bạn đến với chương trình ưu đãi du lịch hấp dẫn cuối năm!",
    time: "01-04-2025 10:00:06",
    image: require("@/assets/images/home/example.png"),
  },
];

export default function NotificationScreen() {
  const [page, setPage] = useState(1);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const handlePageChange = (p: number) => setPage(p);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Icon quay lại */}
        <TouchableOpacity style={styles.iconLeft} onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.title}>Thông báo</Text>

        {/* Icon ba chấm */}
        <TouchableOpacity style={styles.iconRight} onPress={toggleMenu}>
          <Ionicons name="ellipsis-vertical-sharp" size={22} color="black" />
        </TouchableOpacity>

        {/* Menu popup */}
        <Modal
          isVisible={isMenuVisible}
          onBackdropPress={toggleMenu}
          backdropOpacity={0.4}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={styles.menuModal}
        >
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text>Đánh dấu đã đọc tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(screens)/notification/detailNotification",
                params: { notification: JSON.stringify(item) }, 
              })
            }
          >
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.secondtitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.pagination}>
        {[1, 2, 3, 4, "...", 12].map((p, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.pageButton, p === page && styles.pageButtonActive]}
            onPress={() => typeof p === "number" && handlePageChange(p)}
          >
            <Text
              style={[styles.pageText, p === page && styles.pageTextActive]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="right" size={16} color="#F24E1E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginTop: 20,
  },
  iconLeft: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
    fontWeight: "bold",
    paddingLeft: 16,
  },
  iconRight: {
    padding: 8,
  },
  menuModal: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    margin: 0,
    paddingTop: 56, // căn dưới header
    paddingRight: 12,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    top: 16,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  secondtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    color: "#555",
    fontSize: 12,
    marginVertical: 2,
  },
  time: {
    fontSize: 10,
    color: "#888",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 4,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  pageButtonActive: {
    backgroundColor: "#F24E1E",
  },
  pageText: {
    fontSize: 13,
    color: "#333",
  },
  pageTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
