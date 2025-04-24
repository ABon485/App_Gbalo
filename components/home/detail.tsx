import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Detail() {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: "https://i.imgur.com/NVU7LVa.png" }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          Toàn bộ Tour Đà Nẵng - Hội An 5 ngày 4 đêm
        </Text>
        <Text style={styles.rating}>
          ⭐ 4.5+ Đánh giá · 34k khách đã đặt · Khởi hành tại{" "}
          <Text style={styles.link}>Đà Nẵng</Text>
        </Text>

        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>Tiếng anh/ Tiếng thái</Text>
          <Text style={styles.tag}>Tour ghép/tour riêng</Text>
          <Text style={styles.tag}>Đón tại khách sạn</Text>
        </View>

        <Text style={styles.sectionTitle}>Giới thiệu về tour</Text>
        <Text style={styles.description}>
          Tại Sun World Ba Na Hills, du khách dễ dàng tìm thấy hệ thống nhà hàng
          tại 3 khu vực chính:
        </Text>
        <Text style={styles.bullet}>
          • Khám phá thế giới dưới lòng đất của mạng lưới địa đạo phức tạp...
        </Text>
        <Text style={styles.bullet}>
          • Tìm hiểu về cuộc sống phức tạp và sáng tạo của những người lính...
        </Text>

        <Text style={styles.sectionTitle}>Trải nghiệm bao gồm</Text>
        <Text style={styles.bullet}>• Khách sạn 4 sao</Text>
        <Text style={styles.bullet}>• Xe 4 chỗ đưa đón suốt hành trình</Text>
        <Text style={styles.bullet}>• Bao gồm bữa trưa và tối</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Từ <Text style={{ color: "red" }}>1.988.000vnđ</Text> /người
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  rating: {
    color: "#444",
    marginBottom: 10,
  },
  link: {
    color: "#007bff",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
  },
  description: {
    color: "#333",
    marginBottom: 8,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 4,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  price: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
