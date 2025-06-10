import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Review } from "@/types/tour";
import bookingApi from "@/services/tour";
import FileUploadWebView from "@/components/WebView_Upload";
import ImageGalleryModal from "@/components/rating/ImageGalleryModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";

interface MediaItem {
  type: "image" | "video";
  uri: string;
}

const ReviewPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { showToast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [showWebView, setShowWebView] = useState(false);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userId, setUserId] = useState<string>("");

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setUserId(parsedData.id || "");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  // Log params for debugging
  useEffect(() => {
    console.log("Params received:", params);
  }, [params]);

  // Get tour data from navigation parameters
  const tourData = {
    id: (params.tourId as string) || "0",
    name: (params.tourName as string) || "Tour không xác định",
    date: params.departureDate
      ? `Ngày khởi hành: ${new Date(
          params.departureDate as string
        ).toLocaleDateString("vi-VN")}`
      : "Ngày khởi hành: Không xác định",
    status: `Trạng thái: ${(params.status as string) || "Hoàn thành"}`,
    price: `${parseInt((params.totalAmount as string) || "0")
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ`,
    image: (params.tourImage as string) || undefined,
  };

  useEffect(() => {
    console.log("Tour Data:", tourData);
  }, []);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleFileSelected = (fileUrl: string) => {
    const type =
      fileType === "image" || fileUrl.match(/\.(jpg|jpeg|png|gif)$/i)
        ? "image"
        : "video";
    setSelectedMedia([...selectedMedia, { type, uri: fileUrl }]);
    if (type === "image") {
      setImageList([...imageList, fileUrl]);
    }
    setShowWebView(false);
    showToast({
      type: "success",
      message: `Tải lên ${type === "image" ? "hình ảnh" : "video"} thành công`,
    });
  };

  const handleRemoveMedia = (index: number) => {
    const removedMedia = selectedMedia[index];
    setSelectedMedia(selectedMedia.filter((_, i) => i !== index));
    if (removedMedia.type === "image") {
      setImageList(imageList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá");
      return;
    }
    if (reviewText.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    setSubmitting(true);
    try {
      // Construct the Review object
      const reviewData: Review = {
        userId: parseInt(userId || (params.userId as string) || "1", 10),
        star: rating,
        serviceId: parseInt(tourData.id, 10),
        serviceName: tourData.name,
        comment: reviewText.trim(),
        imageUrls: imageList,
        serviceType: 1,
        createdAt: new Date().toISOString(),
      };

      // Call the createRating API
      const response = await bookingApi.createRating(reviewData);

      // Extract the created review from the response
      const createdReview = response.data;

      // Navigate to RatingScreen with the ratingId
      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
      router.push({
        pathname: "/(screens)/rating/myRating",
        params: {
          ratingId: createdReview.id.toString(),
        },
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tourCard}>
          <Image
            source={
              tourData.image
                ? { uri: tourData.image }
                : require("@/assets/images/BackGroud.png")
            }
            style={styles.tourImage}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
          <View style={styles.tourInfo}>
            <Text style={styles.tourName}>{tourData.name}</Text>
            <Text style={styles.tourDate}>{tourData.date}</Text>
            <Text style={styles.tourStatus}>{tourData.status}</Text>
            <Text style={styles.tourPrice}>
              Tổng tiền:{" "}
              <Text style={{ color: "#FF6600", fontWeight: "bold" }}>
                {tourData.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Đánh giá tour</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Icon
                  name={star <= rating ? "star" : "star-border"}
                  size={32}
                  color={star <= rating ? "#FFD700" : "#E0E0E0"}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Viết đánh giá</Text>
          <View style={styles.textInputContainer}>
            <Text style={styles.characterCount}>{reviewText.length}/1000</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Chia sẻ những điều thú vị của chuyến đi này..."
              placeholderTextColor="#999"
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={1000}
            />
          </View>
        </View>
        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Thêm hình ảnh/Video</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => {
                setFileType("image");
                setShowWebView(true);
              }}
            >
              <Icon name="photo-camera" size={24} color="#666" />
              <Text style={styles.mediaButtonText}>Hình ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              //   onPress={() => {
              //     setFileType("video");
              //     setShowWebView(true);
              //   }}
            >
              <Icon name="videocam" size={24} color="#666" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </TouchableOpacity>
          </View>
        </View>
        {selectedMedia.length > 0 && (
          <View style={styles.mediaPreview}>
            {selectedMedia.map((media, index) => (
              <View key={index} style={styles.mediaItem}>
                {media.type === "image" ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImageIndex(imageList.indexOf(media.uri));
                      setIsImageViewerVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: media.uri }}
                      style={styles.previewImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.videoPreview}>
                    <Icon name="play-circle-filled" size={40} color="#666" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveMedia(index)}
                >
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <ImageGalleryModal
          visible={isImageViewerVisible}
          images={imageList}
          index={selectedImageIndex}
          onClose={() => setIsImageViewerVisible(false)}
        />
      </ScrollView>
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Đang gửi..." : "Gửi"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showWebView}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowWebView(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <FileUploadWebView
            token={`User${userId || params.userId || "1"}`}
            onFileSelected={handleFileSelected}
            onClose={() => setShowWebView(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  tourCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tourImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  tourInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  tourName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  tourDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  tourStatus: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  tourPrice: {
    fontSize: 14,
    color: "#666",
  },
  ratingSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starIcon: {
    marginRight: 8,
  },
  reviewSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  textInputContainer: {
    position: "relative",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 100,
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: "#999",
  },
  mediaSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingLeft: 16,
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 20,
    minWidth: 50,
  },
  mediaButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  mediaPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mediaItem: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  videoPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  removeMediaButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ReviewPage;
