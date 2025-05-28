import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Định nghĩa kiểu dữ liệu cho một đánh giá
interface Review {
  id: string;
  userName: string;
  avatar: string; // URL hoặc đường dẫn ảnh avatar
  timeAgo: string;
  rating: number; // Số sao (1-5)
  content: string;
}

// Dữ liệu giả cho danh sách đánh giá
const fakeReviews: Review[] = [
  {
    id: "1",
    userName: "Ji Chang Wook",
    avatar:
      "https://media.istockphoto.com/id/1425103315/vi/anh/ng%C6%B0%E1%BB%9Di-ph%E1%BB%A5-n%E1%BB%AF-ch%C3%A2u-%C3%A1-m%E1%BA%B7c-v%C4%83n-h%C3%B3a-vi%E1%BB%87t-nam-truy%E1%BB%81n-th%E1%BB%91ng-t%E1%BA%A1i-tam-c%E1%BB%91c-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=xZDKlDmMiYEv7r5z0KNgMYfEe19Ozr7s1JXc040TR0Y=",
    timeAgo: "1 tháng trước",
    rating: 5,
    content:
      "Bà Nà Hills là điểm đến hấp dẫn ở Đà Nẵng. Chuyến đi cáp treo mang đến khung cảnh tuyệt đẹp với thác nước và...",
  },
  {
    id: "2",
    userName: "Ji Cha",
    avatar:
      "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg",
    timeAgo: "1 tháng trước",
    rating: 4,
    content:
      "Bà Nà Hills là một nơi tuyệt vời. Chuyến đi này rất đáng nhớ, khung cảnh từ cáp treo tuyệt đẹp...",
  },
  {
    id: "3",
    userName: "Nguyen Van A",
    avatar: "https://nads.1cdn.vn/2024/06/28/W_than-thien-copyrs.jpg",
    timeAgo: "2 tháng trước",
    rating: 5,
    content:
      "Một nơi tuyệt vời để khám phá! Bà Nà Hills có không khí trong lành, cảnh sắc tuyệt đẹp và nhiều hoạt động giải trí...",
  },
];

// Component Rating
export default function Rating() {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const { width } = Dimensions.get("window");
  const router = useRouter();

  const toggleExpand = (id: string) => {
    if (expandedReviews.includes(id)) {
      setExpandedReviews(expandedReviews.filter((reviewId) => reviewId !== id));
    } else {
      setExpandedReviews([...expandedReviews, id]);
    }
  };

  // Hàm cắt ngắn nội dung nếu quá dài
  const truncateContent = (content: string, maxLength: number): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  // Hàm render số sao
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={12}
          color={i <= rating ? "#F24E1E" : "#E5E5EA"}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  // Render mỗi mục đánh giá
  const renderReviewItem = ({ item }: { item: Review }) => {
    const isExpanded = expandedReviews.includes(item.id);
    const displayContent = isExpanded
      ? item.content
      : truncateContent(item.content, 100);

    return (
      <View style={[styles.reviewItem, { width: width * 0.85 }]}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.nameAndTimeRow}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            </View>
            <View style={styles.inlineStars}>{renderStars(item.rating)}</View>
          </View>
        </View>

        <Text style={styles.reviewContent}>{displayContent}</Text>
        {!isExpanded && item.content.length > 100 && (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.showMoreText}>Xem thêm</Text>
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.showMoreText}>Thu gọn</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header: Điểm trung bình và số lượng đánh giá */}
      <View style={styles.header}>
        <Ionicons name="star" size={16} color="#F24E1E" />
        <Text style={styles.ratingSummary}>4.95/5 (648 Đánh giá)</Text>
      </View>

      {/* Danh sách đánh giá - Lướt ngang */}
      <FlatList
        data={fakeReviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={width * 0.8 + 10} // Khoảng cách giữa các mục (width của item + margin)
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* Nút "Hiển thị tất cả đánh giá" */}
      <TouchableOpacity
        style={styles.showAllButton}
        onPress={() => router.push("/rating/rating")}
      >
        <Text style={styles.showAllText}>Hiển thị tất cả 648 đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F6F3",
    paddingVertical: 15,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  ratingSummary: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 5,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  reviewItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameAndStars: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginRight: 6,
  },
  inlineStars: {
    flexDirection: "row",
  },
  timeAgo: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#000",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  nameAndTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  star: {
    marginRight: 2,
  },
  reviewContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 5,
  },
  showAllButton: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
  },
  showAllText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
});
