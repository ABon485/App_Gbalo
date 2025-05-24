import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

export default function DetailNotification() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconLeft} onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết thông báo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={require("@/assets/images/home/example.png")}
          style={styles.image}
        />

        {/* Tiêu đề và ngày */}
        <View style={styles.content}>
          <Text style={styles.heading}>Chương trình du lịch Hè 2025</Text>
          <Text style={styles.date}>01-04-2025 10:00:06</Text>

          {/* Nội dung */}
          <Text style={styles.text}>
            Chúng tôi xin thông báo về chương trình du lịch hè 2025 dành cho
            toàn thể nhân viên công ty. Chương trình sẽ diễn ra tại Đà Nẵng, một
            trong những thành phố biển xinh đẹp và nổi tiếng nhất Việt Nam. Đây
            sẽ là một cơ hội tuyệt vời để mọi người có thể thư giãn, kết nối và
            tạo ra những kỷ niệm đáng nhớ.
          </Text>

          {/* Tiêu đề phụ */}
          <Text style={styles.subheading}>Nội Dung Chương Trình:</Text>

          <Text style={styles.text}>
            Chương trình du lịch không chỉ bao gồm việc tham quan các địa danh
            nổi tiếng mà còn có nhiều hoạt động thú vị, giúp mọi người thư giãn
            và gắn kết hơn. Dưới đây là một số hoạt động nổi bật trong chương
            trình:
          </Text>

          <Text style={styles.bullet}>
            • Tham Quan Bà Nà Hills: Với không khí trong lành, khung cảnh thiên
            nhiên tuyệt đẹp và cầu Vàng nổi tiếng, Bà Nà Hills là điểm dừng chân
            hấp dẫn trong mỗi hành trình và sẽ giúp bạn có những kỷ niệm đáng
            nhớ.
          </Text>
          <Image
            source={require("@/assets/images/home/banahill.png")}
            style={styles.detailImage}
          />

          <Text style={styles.bullet}>
            • Tắm Biển Mỹ Khê: Nổi tiếng với bãi cát trắng mịn và làn nước trong
            xanh, biển Mỹ Khê sẽ mang đến cho các bạn những giây phút thư giãn
            tuyệt vời. Đừng quên mang theo đồ bơi để tham gia các hoạt động dưới
            nước như lướt sóng, bóng chuyền bãi biển hoặc đơn giản là nằm tắm
            nắng.
          </Text>

          <Image
            source={require("@/assets/images/home/Beach.png")}
            style={styles.detailImage}
          />

          {/* Thời gian khởi hành và kết thúc */}
          <View style={styles.timeBox}>
            <Text style={styles.subheading}>Thời Gian:</Text>
            <Text style={styles.bullet}>• Thời gian khởi hành: 10/07/2025</Text>
            <Text style={styles.bullet}>• Thời gian kết thúc: 15/07/2025</Text>
          </View>

          {/* Nút Đặt ngay */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đặt ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  iconLeft: {
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginLeft: 12,
  },
  detailImage: {
    width: "100%",
    height: 180,
    marginVertical: 12,
  },

  timeBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#F24E1E",
    paddingVertical: 12,
    marginHorizontal: 90,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
