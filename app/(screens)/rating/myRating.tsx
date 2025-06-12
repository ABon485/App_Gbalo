import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageGalleryModal from "@/components/rating/ImageGalleryModal";
import { router, useLocalSearchParams } from "expo-router";
import bookingApi from "@/services/tour";
import { Review, ReviewListResponse } from "@/types/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewDetailScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const params = useLocalSearchParams();

  console.log("Params:", params); // Debug params

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setUserId(parsedData.id || null);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  // Lấy danh sách đánh giá
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;

      try {
        const response: ReviewListResponse = await bookingApi.getRatingList({
          userId: parseInt(userId, 10),
          page: 1,
          pageSize: 10,
        });
        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.warn("response.data is not an array:", response.data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.noOrderContainer}>
          <Text style={styles.noOrderText}>
            Vui lòng đăng nhập để xem đánh giá
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auths)/(Login)/loginEmail")}
          >
            <Text style={{ color: "#F97316", marginTop: 8 }}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { paddingHorizontal: 16 }]}
        onPress={() => router.back()}
      >
        <AntDesign name="arrowleft" size={20} color="black" />
        <Text style={styles.rating}> Đánh giá của tôi </Text>
      </TouchableOpacity>

      {reviews.length === 0 ? (
        <View style={styles.noOrderContainer}>
          <Image
            source={require("@/assets/images/NoFeeback.png")}
            style={styles.noOrderImage}
          />
          <Text style={styles.noOrderText}>Bạn chưa có đánh giá nào</Text>
        </View>
      ) : (
        <ScrollView style={{ paddingHorizontal: 16 }}>
          {reviews.map((review, index) => {
            const hasNoReviewContent =
              !review.comment?.trim() && (!review.star || review.star === 0);

            if (hasNoReviewContent) return null;

            return (
              <View key={review.id || index} style={styles.reviewCard}>
                <View style={styles.headerBody}>
                  <Text style={styles.ratingText}>
                    Ngày đánh giá:{" "}
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>

                <View style={styles.userRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.starRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <AntDesign
                          key={i}
                          name={i < review.star ? "star" : "staro"}
                          size={14}
                          color="#F97316"
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <Text style={styles.ratingTour}>
                  Đánh giá cho tour:{" "}
                  <Text style={styles.ratingTourName}>
                    {review.serviceName}
                  </Text>
                </Text>

                <Text style={styles.content}>{review.comment}</Text>

                {review.imageUrls.length > 0 && (
                  <View style={styles.imageRow}>
                    {review.imageUrls.map((uri, idx) => (
                      <Pressable
                        key={idx}
                        style={styles.imageWrapper}
                        onPress={() => {
                          setSelectedImages(
                            review.imageUrls.map((uri) => ({ uri }))
                          );
                          setSelectedIndex(idx);
                          setModalVisible(true);
                        }}
                      >
                        <Image source={{ uri }} style={styles.reviewImage} />
                        {idx === 1 && review.imageUrls.length > 2 && (
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>
                              +{review.imageUrls.length - 2}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <ImageGalleryModal
            visible={modalVisible}
            images={selectedImages.map((img) =>
              typeof img === "number"
                ? img
                : (img as { uri?: string }).uri ?? ""
            )}
            index={selectedIndex}
            onClose={() => setModalVisible(false)}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 35,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  ratingTour: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 20,
  },
  ratingTourName: {
    fontWeight: "400",
    color: "#000",
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  imageRow: {
    flexDirection: "row",
    gap: 8,
  },
  reviewImage: {
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
  noOrderContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 16,
  },
  noOrderImage: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    top: -100,
  },
  noOrderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    top: -100,
  },
});
