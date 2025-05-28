import React, { useEffect, useState, useCallback } from "react";
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

const formatPrice = (price: number): string =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " vnđ";

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
  const formattedImages = useMemo(
    () => imageList.map((img) => ({ uri: img })),
    [imageList]
  );

  const provinceIds = params?.provinceIds
    ? JSON.parse(params.provinceIds as string)
    : [];

  useFocusEffect(
    useCallback(() => {
      const fetchTourDetail = async () => {
        try {
          const detail = await tourApi.TourDetail(Number(tourId) || 0);
          setTour(detail);
        } catch (error) {
          console.error("Lỗi API (Tour Detail):", error);
        }
      };

      const fetchImage = async () => {
        try {
          const response = await fetch(
            `https://files.vbalo.com/list/Tours${tourId}`
          );
          const data = await response.json();
          if (data.status === "Success" && data.data?.length > 0) {
            setImageList(data.data);
            setImageUrl(data.data[0]);
          } else {
            setImageList([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy ảnh:", error);
          setImageList([]);
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

      fetchTourDetail();
      fetchImage();
      fetchUserInfo();
    }, [tourId])
  );

  function cleanAndTruncateSchedule(
    html: string | null | undefined,
    maxBlocks = 2
  ) {
    if (!html || typeof html !== "string") {
      return ""; // Return an empty string or fallback content if html is null/undefined
    }
    const blocks = html.match(/<p[\s\S]*?<\/p>/gi);
    const cleanedHtml = html.replace(/<p>\s*<\/p>/gi, "");
    if (!blocks || blocks.length <= maxBlocks) return cleanedHtml;
    return blocks.slice(0, maxBlocks).join("");
  }

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleBookTour = async () => {
    try {
      const userData = await AsyncStorage.getItem("data");
      const userInfo = userData ? JSON.parse(userData) : null;
      if (!userInfo) {
        router.push("/(auths)/(Login)/login");
        return;
      }
      setShowOrderModal(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra thông tin người dùng:", error);
      router.push("/(auths)/(Login)/login");
    }
  };

  if (!tour) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin tour...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconCartButton}>
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
          {/* Image */}
          {imageList.length > 0 && width > 0 ? (
            <FlatList
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
          ) : (
            <Image
              source={require("@/assets/images/home/Property1.png")}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          // Gọi modal ImageGalleryModal ở cuối JSX trong Detail
          <ImageGalleryModal
            visible={isImageViewerVisible}
            images={imageList}
            index={selectedImageIndex}
            onClose={() => setIsImageViewerVisible(false)}
          />
          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{tour.name}</Text>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F24E1E" />
              <Text style={styles.rating}>
                0 Đánh giá • 0 khách đã đặt • Khởi hành tại Đà Nẵng
              </Text>
            </View>

            <View style={styles.tagsContainer}>
              {tour.tourExtraServices.map((service) => (
                <Text key={service.id} style={styles.tag}>
                  {service.name}
                </Text>
              ))}
            </View>

            {/* Giới thiệu */}
            <Text style={styles.sectionTitle}>Giới thiệu về tour</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.description, 2) }}
              tagsStyles={{
                p: {
                  marginBottom: 12,
                  lineHeight: 20,
                },
              }}
            />

            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowIntroModal(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>
            <TourDetailModal
              visible={showIntroModal}
              onClose={() => setShowIntroModal(false)}
              title="Giới thiệu về tour"
              content={tour.description}
            />

            <Text style={styles.sectionTitle}>Trải nghiệm bao gồm</Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: tour.included || "" }}
            />

            <Text style={styles.sectionTitle}>Lịch trình chi tiết</Text>

            <RenderHtml
              contentWidth={width}
              source={{ html: cleanAndTruncateSchedule(tour.schedule, 2) }}
              tagsStyles={{
                p: {
                  // marginTop: 0,
                  marginBottom: 10,
                  lineHeight: 20,
                },
              }}
              baseStyle={{
                marginTop: 0,
              }}
            />

            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowScheduleModal(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>

            <SchechuleModal
              visible={showScheduleModal}
              onClose={() => setShowScheduleModal(false)}
              content={tour.schedule}
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
              content={tour.policies}
              title="Yêu cầu đối với khách hàng"
            />
          </View>
          <Rating />
          {/* Các tour tương tự */}
          <Text style={styles.section1}>Tour tương tự</Text>
          <SimilarTour provinceIds={provinceIds} tourId={Number(tourId) || 0} />
        </View>
      </ScrollView>

      {/* Footer */}
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
          // Inside Detail.js
          <Order
            visible={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            title="Đơn hàng"
            fromPrice={tour.fromPrice}
            tourId={tour.id}
            user={user}
            imageUrl={imageUrl}
            tourName={tour.name}
            tourSubName={tour.subName}
            tourPrices={tour.tourPrices.map((tp) => ({
              ...tp,
              unitName: tp.unitName ?? null,
            }))}
            onConfirm={() => setShowOrderModal(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
