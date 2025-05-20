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

const formatPrice = (price: number): string =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";

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
            setImageUrl(data.data[0]);
          } else {
            setImageUrl(null);
          }
        } catch (error) {
          console.error("Lỗi khi lấy ảnh:", error);
          setImageUrl(null);
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

  const truncateHTML = (html: string | null, maxLength: number): string => {
    if (!html) return "<p></p>";
    const plainText = html.replace(/<[^>]*>/g, "");
    const shortText =
      plainText.length > maxLength
        ? plainText.substring(0, maxLength).trim() + "..."
        : plainText;
    return `<p>${shortText}</p>`;
  };

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
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("@/assets/images/home/Property1.png")
            }
            style={styles.image}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{tour.name}</Text>
            <Text style={styles.subTitle}>{tour.slug}</Text>
            {/* <Text style={styles.subTitle}>{tour.subName}</Text> */}

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F24E1E" />
              <Text style={styles.rating}>
                4.5+ Đánh giá • 34K khách đã đặt • Khởi hành tại Đà Nẵng
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
              source={{ html: truncateHTML(tour.description, 150) }}
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
              source={{ html: truncateHTML(tour.schedule, 350) }}
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
              source={{ html: truncateHTML(tour.policies, 150) }}
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
          <Text style={styles.sectionTitle}>Các tour tương tự</Text>
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
            onConfirm={() => setShowOrderModal(false)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
