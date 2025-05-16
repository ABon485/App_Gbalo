import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
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

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

export default function Detail() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExtraUserModal, setShowExtraUserModal] = useState(false);
  const tourId = Number(params?.detailID);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTourDetail = async () => {
        try {
          const detail = await tourApi.TourDetail(tourId);
          setTour(detail);
          console.log("Tour Detail:", detail);
          console.log("Tour Detail:", tourId);
        } catch (error) {
          console.error("Lỗi API:", error);
        }
      };

      const fetchUserInfo = async () => {
        try {
          const userData = await AsyncStorage.getItem("data");
          const userInfo = userData ? JSON.parse(userData) : null;
          console.log("User Info:", userInfo); // Debug
          setUser(userInfo);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };

      fetchTourDetail();
      fetchUserInfo();
    }, [tourId])
  );

  const truncateHTML = (html: string, maxLength: number): string => {
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
      <FlatList
        data={[tour]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
              source={require("@/assets/images/home/Property1.png")}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subTitle}>{item.subName}</Text>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F24E1E" />
                <Text style={styles.rating}>
                  4.5+ Đánh giá • 34K khách đã đặt • Khởi hành tại Đà Nẵng
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                {item.tourExtraServices.map((service) => (
                  <Text key={service.id} style={styles.tag}>
                    {service.name}
                  </Text>
                ))}
              </View>

              {/* Giới thiệu về tour */}
              <Text style={styles.sectionTitle}>Giới thiệu về tour</Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: truncateHTML(item.description, 150) }}
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
                content={item.description}
              />

              <Text style={styles.sectionTitle}>Trải nghiệm bao gồm</Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: item.included }}
              />

              <SchechuleModal
                visible={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                content={item.schedule}
                title="Lịch trình chi tiết"
              />

              <ExtraUserModal
                visible={showExtraUserModal}
                onClose={() => setShowExtraUserModal(false)}
                content={item.policies}
                title="Yêu cầu đối với khách hàng"
              />
            </View>
          </View>
        )}
      />

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
            onConfirm={() => {
              setShowOrderModal(false);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}