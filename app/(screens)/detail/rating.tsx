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
    avatar: "https://example.com/avatar1.jpg",
    timeAgo: "1 tháng trước",
    rating: 5,
    content:
      "Bà Nà Hills là điểm đến hấp dẫn ở Đà Nẵng. Chuyến đi cáp treo mang đến khung cảnh tuyệt đẹp với thác nước và...",
  },
  {
    id: "2",
    userName: "Ji Cha",
    avatar: "https://example.com/avatar2.jpg",
    timeAgo: "1 tháng trước",
    rating: 4,
    content: "Bà Nà Hills là một nơi tuyệt vời. Chuyến đi này rất đáng nhớ, khung cảnh từ cáp treo tuyệt đẹp...",
  },
  {
    id: "3",
    userName: "Nguyen Van A",
    avatar: "https://example.com/avatar3.jpg",
    timeAgo: "2 tháng trước",
    rating: 5,
    content:
      "Một nơi tuyệt vời để khám phá! Bà Nà Hills có không khí trong lành, cảnh sắc tuyệt đẹp và nhiều hoạt động giải trí...",
  },
];

// Component Rating
export default function Rating() {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]); // Quản lý trạng thái mở rộng của các đánh giá
  const { width } = Dimensions.get("window");

  // Hàm xử lý mở rộng/thu gọn nội dung đánh giá
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
      : truncateContent(item.content, 50); // Cắt ngắn nội dung nếu chưa mở rộng

    return (
      <View style={[styles.reviewItem, { width: width * 0.8 }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            onError={() => console.log("Failed to load avatar:", item.avatar)}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
        <Text style={styles.reviewContent}>{displayContent}</Text>
        {item.content.length > 50 && (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={styles.showMoreText}>
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Text>
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
      <TouchableOpacity style={styles.showAllButton}>
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
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
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
    backgroundColor: "#E5E5EA", // Placeholder nếu ảnh không load được
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  timeAgo: {
    fontSize: 12,
    color: "#8E8E93",
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
  showMoreText: {
    fontSize: 14,
    textDecorationLine: "underline",
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