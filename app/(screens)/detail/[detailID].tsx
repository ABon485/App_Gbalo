import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { TourDetail } from "@/types/tour";
import styles from "@/styles/detail/detail";
import TourDetailModal from "@/components/home/TourDetailModal";
import SchechuleModal from "@/components/home/schechuleDetaiModal";
import ExtraUserModal from "@/components/home/extraUserModal";
import tourApi from "@/services/tour";
import { useFocusEffect } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import Order from "@/components/booking/order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimilarTour from "@/app/(screens)/detail/similarTour";
import Rating from "./rating";
import { FlatList } from "react-native";
import { useMemo } from "react";
import ImageGalleryModal from "@/components/rating/ImageGalleryModal";
import { BookingServiceRequest } from '@/types/tour';
// import { useToast } from "@/context/ToastContext";

const formatPrice = (price: number): string =>
  price
    ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " vnđ"
    : "0 vnđ";

export default function Detail() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExtraUserModal, setShowExtraUserModal] = useState(false);
  const tourId = params?.detailID;
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const { showToast } = useToast();
  const [showIncludedModal, setShowIncludedModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const formattedImages = useMemo(
    () => imageList.map((img) => ({ uri: img })),
    [imageList]
  );

  const provinceIds = params?.provinceIds
    ? JSON.parse(params.provinceIds as string)
    : [];

  useFocusEffect(
    useCallback(() => {
      const loadSelectedTour = async () => {
        try {
          const selectedTourData = await AsyncStorage.getItem("selectedTour");
          if (selectedTourData) {
            const selectedTour = JSON.parse(selectedTourData);
            setTour(selectedTour.detail || null);
            setImageList(selectedTour.images || []);
            setImageUrl(selectedTour.images?.[0] || null);
            setIsFavorite(selectedTour.isFavorite || false);
          } else {
            // Fallback to API if no cached data
            const detail = await tourApi.TourDetail(Number(tourId) || 0);
            setTour(detail || null);
            const imageRes = await fetch(
              `https://files.vbalo.com/list/Tours${tourId}`
            );
            const imageData = await imageRes.json();
            if (imageData.status === "Success" && imageData.data?.length > 0) {
              setImageList(imageData.data);
              setImageUrl(imageData.data[0]);
            } else {
              setImageList([]);
              setImageUrl(null);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tải tour đã chọn:", error);
          // showToast({ type: "error", message: "Không thể tải chi tiết tour." });
        }
      };

      const fetchUserInfo = async () => {
        try {
          const userData = await AsyncStorage.getItem("data");
          const userInfo = userData ? JSON.parse(userData) : null;
          setUser(userInfo);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };

      loadSelectedTour();
      fetchUserInfo();
    }, [tourId])
  );

  const toggleFavorite = async () => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        // showToast({
        //   type: "error",
        //   message: "Vui lòng đăng nhập để lưu tour yêu thích.",
        // });
        router.push("/(auths)/(Login)/login");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;
      const token = parsedData.token;

      if (!userId || !token) {
        // showToast({
        //   type: "error",
        //   message:
        //     "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        // });
        router.push("/(auths)/(Login)/login");
        return;
      }

      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      if (newFavoriteStatus) {
        await tourApi.postFavorite(userId, Number(tourId));
        // showToast({
        //   type: "success",
        //   message: "Đã thêm vào danh sách yêu thích.",
        // });
      } else {
        await tourApi.deleteFavorite(userId, Number(tourId));
        // showToast({
        //   type: "success",
        //   message: "Đã xóa khỏi danh sách yêu thích.",
        // });
      }

      const favoriteRes = await tourApi.getFavorite(userId);
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify(favoriteRes.data.datas)
      );
    } catch (err) {
      console.error("Lỗi khi lưu yêu thích:", err);
      // showToast({
      //   type: "error",
      //   message: "Không thể cập nhật yêu thích. Vui lòng thử lại.",
      // });
      setIsFavorite(!isFavorite);
    }
  };

  const handleAddToCart = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const userInfo = userData ? JSON.parse(userData) : null;

      if (!userInfo?.token) {
        console.warn("Lỗi xác thực: Không tìm thấy token người dùng");
        router.push("/(auths)/(Login)/login");
        return;
      }

      if (!userInfo?.id && !userInfo?.customerId) {
        console.warn("Lỗi: Không tìm thấy customerId trong userInfo");
        router.push("/(auths)/(Login)/login");
        return;
      }

      // Thay bằng dữ liệu thực tế
      const tourDetails = {
        serviceId: Number(tourId),
        serviceName: "Tour Name", // Lấy từ API hoặc state
        price: 1000, // Lấy từ API hoặc state
        departureDate: new Date().toISOString(), // Lấy từ người dùng hoặc API
        serviceDetailId: Number(tourId), // Lấy từ API hoặc state
      };

      const payload: BookingServiceRequest = {
        customerId: userInfo.id || userInfo.customerId,
        departureDate: tourDetails.departureDate,
        serviceId: tourDetails.serviceId,
        serviceName: tourDetails.serviceName,
        price: tourDetails.price,
        services: [
          {
            serviceDetailId: tourDetails.serviceDetailId,
            quantity: 1,
            price: tourDetails.price,
          },
        ],
      };

      console.log("Payload gửi đi:", payload);
      const response = await tourApi.AddToCart(payload);
      console.log("Đã thêm vào giỏ hàng:", response);

      // showToast({ type: 'success', message: 'Đã thêm vào giỏ hàng.' });
    } catch (error) {
      let errorMessage = "Không thể thêm vào giỏ hàng.";
      if (error && typeof error === "object" && "response" in error) {
        const err = error as any;
        errorMessage = err.response?.data?.message || errorMessage;
        console.error("Thêm vào giỏ hàng thất bại:", {
          message: err.message || "Lỗi không xác định",
          stack: err.stack || "Không có stack trace",
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers,
              }
            : "Không có phản hồi từ server",
          name: err.name || "UnknownError",
        });
      } else {
        console.error("Thêm vào giỏ hàng thất bại:", error);
      }

      // showToast({ type: 'error', message: errorMessage });
    }
  };

  const handleBookTour = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const userInfo = userData ? JSON.parse(userData) : null;
      if (!userInfo) {
        // showToast({
        //   type: "error",
        //   message: "Vui lòng đăng nhập để đặt tour.",
        // });
        router.push("/(auths)/(Login)/login");
        return;
      }
      setShowOrderModal(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra thông tin người dùng:", error);
      // showToast({
      //   type: "error",
      //   message: "Không thể kiểm tra thông tin người dùng.",
      // });
      router.push("/(auths)/(Login)/login");
    }
  };

  useEffect(() => {
    if (!imageList || imageList.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imageList.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      setSelectedImageIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, imageList]);

  const cleanAndTruncateSchedule = (
    html: string | null | undefined,
    maxBlocks = 2
  ) => {
    if (!html || typeof html !== "string") return "";
    const blocks = html.match(/<p[\s\S]*?<\/p>/gi);
    const cleanedHtml = html.replace(/<p>\s*<\/p>/gi, "");
    if (!blocks || blocks.length <= maxBlocks) return cleanedHtml;
    return blocks.slice(0, maxBlocks).join("");
  };

  if (!tour) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          {/* <Text>Đang tải thông tin tour...</Text> */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCartButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={24} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#ff5c5c" : "#000000"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconShareButton}>
              <FontAwesome5 name="share-square" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatListRef}
            data={imageList}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={2}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
              setCurrentIndex(index);
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setIsImageViewerVisible(true);
                }}
              >
                <View>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 250 }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 20,
                      backgroundColor: "rgba(0, 0, 0, 0.99)",
                      borderRadius: 5,
                      paddingHorizontal: 15,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>
                      {index + 1}/{imageList.length}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <ImageGalleryModal
            visible={isImageViewerVisible}
            images={imageList}
            index={selectedImageIndex}
            onClose={() => setIsImageViewerVisible(false)}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{tour.name || "Không có tiêu đề"}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 18,
              }}
            >
              <View style={{ paddingTop: 2 }}>
                <Ionicons name="star" size={14} color="#F24E1E" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text
                  style={{ fontSize: 14, lineHeight: 20, flexWrap: "wrap" }}
                >
                  {tour.regionId}{" "}
                  <Text style={{ textDecorationLine: "underline" }}>
                    Đánh giá
                  </Text>{" "}
                  · {tour.regionId} khách đã đặt ·{" "}
                  <Text style={{ textDecorationLine: "underline" }}>
                    Khởi hành tại {tour?.provinceName || "Không có thông tin"}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.tagsContainer}>
              {tour.tourExtraServices?.map((service) => (
                <Text key={service.id} style={styles.tag}>
                  {service.name}
                </Text>
              )) || <Text>Không có dịch vụ bổ sung</Text>}
            </View>
            <Text style={styles.sectionTitle}>Giới thiệu về tour</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.description, 2) }}
              tagsStyles={{ p: { marginBottom: 12, lineHeight: 20 } }}
            />
            {tour.description ? (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowIntroModal(true)}
              >
                <Text style={styles.showMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            ) : null}
            <TourDetailModal
              visible={showIntroModal}
              onClose={() => setShowIntroModal(false)}
              title="Giới thiệu về tour"
              content={tour.description || ""}
            />

            <Text style={styles.sectionTitle}>Trải nghiệm bao gồm</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.included, 2) }}
              tagsStyles={{ p: { marginBottom: 10, lineHeight: 20 } }}
              baseStyle={{ marginTop: 0 }}
            />
            {tour.included ? (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowIncludedModal(true)}
              >
                <Text style={styles.showMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            ) : null}
            <TourDetailModal
              visible={showIncludedModal}
              onClose={() => setShowIncludedModal(false)}
              title="Trải nghiệm bao gồm"
              content={tour.included || ""}
            />

            <Text style={styles.sectionTitle}>Lịch trình chi tiết</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.schedule, 2) }}
              tagsStyles={{ p: { marginBottom: 10, lineHeight: 20 } }}
              baseStyle={{ marginTop: 0 }}
            />
            {tour.schedule ? (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowScheduleModal(true)}
              >
                <Text style={styles.showMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            ) : null}
            <SchechuleModal
              visible={showScheduleModal}
              onClose={() => setShowScheduleModal(false)}
              content={tour.schedule || ""}
              title="Lịch trình chi tiết"
            />

            <Text style={styles.sectionTitle}>Những yêu cầu đối với khách</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.policies, 2) }}
            />
            <ExtraUserModal
              visible={showExtraUserModal}
              onClose={() => setShowExtraUserModal(false)}
              content={tour.policies || ""}
              title="Yêu cầu đối với khách hàng"
            />
          </View>
          <Rating />
          <Text style={styles.section1}>Tour tương tự</Text>
          <SimilarTour provinceIds={provinceIds} tourId={Number(tourId) || 0} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>
            Từ{" "}
            <Text style={styles.priceHighlight}>
              {formatPrice(tour.fromPrice)}
            </Text>
            /người
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleBookTour}>
          <Text style={styles.buttonText}>Đặt ngay</Text>
        </TouchableOpacity>
        {showOrderModal && (
          <Order
            visible={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            title="Đơn hàng"
            fromPrice={tour.fromPrice || 0}
            tourId={tour.id || 0}
            user={user}
            imageUrl={imageUrl}
            tourName={tour.name || ""}
            tourSubName={tour.subName || ""}
            tourPrices={
              tour.tourPrices?.map((tp) => ({
                ...tp,
                unitName: tp.unitName ?? null,
              })) || []
            }
            onConfirm={() => setShowOrderModal(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
