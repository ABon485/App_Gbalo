import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageGalleryModal from "@/components/rating/ImageGalleryModal";

export default function RatingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      user: "Ji Chang Wook",
      time: "1 giờ trước",
      content:
        "Bà Nà Hills là điểm đến hấp dẫn ở Đà Nẵng. Chuyến đi cáp treo mang đến khung cảnh tuyệt đẹp. Khu làng Pháp rất độc đáo và đẹp như châu Âu thu nhỏ. Thời tiết mát mẻ, dễ chịu. Thực sự là trải nghiệm không thể bỏ qua khi đến Đà Nẵng.",
      images: [
        { source: require("@/assets/images/home/banahill.png"), id: "1-0" },
        { source: require("@/assets/images/home/Beach.png"), id: "1-1" },
        { source: require("@/assets/images/home/cauvang.png"), id: "1-2" },
      ],
    },
    {
      id: 2,
      user: "Ji Chang Wook",
      time: "3 ngày trước",
      content:
        "Chúng tôi may mắn vì phần lớn thời tiết đều trong xanh và ấm áp. Bà Nà Hills rất đông khách nhưng mọi thứ đều được tổ chức khá chuyên nghiệp. Cầu Vàng rất ấn tượng và là điểm check-in tuyệt vời.",
      images: [
        { source: require("@/assets/images/home/Beach.png"), id: "2-0" },
        { source: require("@/assets/images/home/cauvang.png"), id: "2-1" },
      ],
    },
    {
      id: 3,
      user: "Ji Chang Wook",
      time: "3 ngày trước",
      content:
        "Chúng tôi may mắn vì phần lớn thời tiết đều trong xanh và ấm áp. Bà Nà Hills rất đông khách nhưng mọi thứ đều được tổ chức khá chuyên nghiệp. Cầu Vàng rất ấn tượng và là điểm check-in tuyệt vời.",
      images: [
        { source: require("@/assets/images/home/banahill.png"), id: "2-0" },
        { source: require("@/assets/images/home/Beach.png"), id: "2-1" },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 35 }}>
      {/* Header cố định */}
      <View style={[styles.header, { paddingHorizontal: 16 }]}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.rating}> Đánh giá</Text>
      </View>

      {/* ScrollView cho phần đánh giá */}
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {/* Điểm số tổng quan */}
        <View style={[styles.headerBody, { paddingHorizontal: 12 }]}>
          <AntDesign name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>4.95/5 (648 Đánh giá)</Text>
        </View>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.userRow}>
              <Image
                source={require("@/assets/images/home/Beach.png")}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.username}>{review.user}</Text>
                  <Text style={styles.time}>{review.time}</Text>
                </View>
                <View style={styles.starRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AntDesign key={i} name="star" size={14} color="#F97316" />
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.content}>{review.content}</Text>

            <View style={styles.imageRow}>
              {review.images.slice(0, 2).map((imgObj, idx) => (
                <Pressable
                  key={`${review.id}-${idx}`}
                  style={styles.imageWrapper}
                  onPress={() => {
                    setSelectedImages(review.images.map((i) => i.source));
                    setSelectedIndex(idx);
                    setModalVisible(true);
                  }}
                >
                  <Image source={imgObj.source} style={styles.reviewImage} />
                  {idx === 1 && review.images.length > 2 && (
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>
                        {`${review.images.length - 1}+`}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Image Modal Viewer */}
        <ImageGalleryModal
          visible={modalVisible}
          images={selectedImages}
          index={selectedIndex}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerBody: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewCard: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  imageRow: {
    flexDirection: "row",
    gap: 8,
  },
  reviewImage: {
    flexDirection: "row",
    width: 160,
    height: 120,
    borderRadius: 8,
  },
  imageWrapper: {
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
