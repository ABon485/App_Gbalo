import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { TourDetail } from "@/types/tour";
import styles from "@/styles/detail/detail";
import TourDetailModal from "@/components/home/TourDetailModal";
import SchechuleModal from "@/components/home/schechuleDetaiModal";
import ExtraUserModal from "@/components/home/extraUserModal";

// Format price to VND
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

// Sample data updated to match the new TourDetail type
const tourData: TourDetail[] = [
  {
    id: 1,
    name: "Tour sớm đến Bà Nà Hills/Cầu Vàng",
    slug: "tour-ba-na-hills",
    subName: "Khám phá Cầu Vàng",
    duration: "1 ngày",
    description:
      "Tại Sun World Ba Na Hills, du khách dễ dàng tìm thấy hệ thống nhà hàng tại 3 khu vực chính. Khám phá thế giới tuyệt vời với nhiều trải nghiệm độc đáo.",
    included:
      "Khách sạn 4 sao, Xe 4 chỗ đưa đón suốt hành trình, Bao gồm bữa trưa và tối, Bảo hiểm cá nhân",
    schedule:
      "07:30: Quý khách ăn sáng. Xe và HDV đón quý khách tại khách sạn hoặc các điểm hẹn.",
    policies:
      "Khách phải đủ tuổi uống rượu bia mới được phục vụ đồ uống có cồn.\nKhách từ 4 tuổi trở lên có thể tham gia, tổng cộng tối đa 10 khách. Cha mẹ cũng có thể mang theo trẻ dưới 2 tuổi.",
    rules:
      "Khách phải đủ tuổi uống rượu bia mới được phục vụ đồ uống có cồn. Khách từ 4 tuổi trở lên có thể tham gia, đoàn tối đa 10 khách. Cha mẹ có thể mang theo trẻ dưới 2 tuổi.",
    fromPrice: 1234567,
    tourExtraServices: [
      { id: 1, name: "Hướng dẫn viên tiếng Anh" },
      { id: 2, name: "Buffet trưa" },
    ],
    tourPrices: [
      {
        id: 1,
        unitPriceId: 1,
        namePrice: "Người lớn",
        price: 1234567,
        unitId: 1,
      },
      {
        id: 2,
        unitPriceId: 2,
        namePrice: "Trẻ em",
        price: 617283,
        unitId: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Tour khám phá Đà Nẵng",
    slug: "tour-da-nang",
    subName: "Thành phố biển",
    duration: "2 ngày 1 đêm",
    description:
      "Khám phá vẻ đẹp của Đà Nẵng với các điểm đến nổi tiếng như Cầu Rồng, Bãi biển Mỹ Khê và Ngũ Hành Sơn.",
    included:
      "Khách sạn 4 sao, Xe 4 chỗ đưa đón, Bao gồm bữa sáng và trưa, Bảo hiểm du lịch",
    schedule:
      "08:00: Đón khách tại khách sạn. 09:00: Tham quan Cầu Rồng. 12:00: Ăn trưa.",
    policies:
      "Khách phải đủ tuổi uống rượu bia mới được phục vụ đồ uống có cồn.\nKhách từ 4 tuổi trở lên có thể tham gia, tổng cộng tối đa 10 khách. Cha mẹ cũng có thể mang theo trẻ dưới 2 tuổi.",
    rules: "Khách từ 6 tuổi trở lên có thể tham gia. Đoàn tối đa 12 khách.",
    fromPrice: 2456789,
    tourExtraServices: [
      { id: 1, name: "Hướng dẫn viên tiếng Thái" },
      { id: 2, name: "Vé tham quan" },
    ],
    tourPrices: [
      {
        id: 1,
        unitPriceId: 1,
        namePrice: "Người lớn",
        price: 2456789,
        unitId: 1,
      },
      {
        id: 2,
        unitPriceId: 2,
        namePrice: "Trẻ em",
        price: 1228394,
        unitId: 2,
      },
    ],
  },
];

export default function Detail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMore, setShowMore] = useState({
    schedule: false,
    rules: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExtraUserModal, setShowExtraUserModal] = useState(false);

  // Fetch tour data based on ID
  useEffect(() => {
    const tourId = Number(params.id || params.detailID || 1);
    const selectedTour = tourData.find((item) => item.id === tourId);

    if (selectedTour) {
      setTour(selectedTour);
      setIsFavorite(false); // Default to false; can be enhanced with user-specific logic
    } else {
      setTour(tourData[0]);
      setIsFavorite(false);
    }
  }, [params]);

  // Handle loading state
  if (!tour) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin tour...</Text>
      </View>
    );
  }

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle booking
  const handleBookTour = () => {
    console.log("Đặt tour:", tour.id);
  };

  return (
    <>
      <Stack.Screen
        name="/(screens)/[detailID]"
        options={{ headerShown: false }}
      />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container}>
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

          {/* Tour Image (Using placeholder as no image in type) */}
          <Image
            source={require("@/assets/images/home/Property1.png")}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.content}>
            {/* Tour Name and SubName */}
            <Text style={styles.title}>{tour.name}</Text>
            <Text style={styles.subTitle}>{tour.subName}</Text>

            <View style={styles.ratingContainer}>
              <Ionicons
                name="star"
                size={16}
                color="#F24E1E"
                style={styles.icon}
              />
              <Text style={styles.rating}>
                4.5+ Đánh giá • 34K khách đã đặt • Khởi hành tại Đà Nẵng
              </Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <Text style={styles.tag}>Tiếng anh/ Tiếng thái</Text>
              <Text style={styles.tag}>Tour ghép/tour riêng</Text>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Giới thiệu về tour</Text>
            <Text style={styles.description}>{tour.description}</Text>
            {tour.description.split(". ").map((sentence, index) => (
              <Text key={index} style={styles.bullet}>
                • {sentence.trim()}
              </Text>
            ))}

            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowIntroModal(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>

            {/* Modal cho phần giới thiệu */}
            <TourDetailModal
              visible={showIntroModal}
              onClose={() => setShowIntroModal(false)}
              // type="intro"
              // data={tour}
            />

            {/* Included Services */}
            <Text style={styles.sectionTitle}>Trải nghiệm bao gồm</Text>
            <View style={styles.includesContainer}>
              {tour.included.split(", ").map((item, index) => (
                <View style={styles.includeItem} key={index}>
                  <Ionicons
                    name={
                      item.includes("Khách sạn")
                        ? "bed-outline"
                        : item.includes("Xe")
                        ? "car-outline"
                        : item.includes("bữa")
                        ? "fast-food-outline"
                        : "card-outline"
                    }
                    size={20}
                    color="#555"
                  />
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Schedule */}
            <Text style={styles.sectionTitle}>Lịch trình chi tiết</Text>
            <View style={styles.itineraryItem}>
              <View style={styles.itineraryIcon}>
                <Ionicons name="location-outline" size={20} color="#555" />
              </View>
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryText}>
                  Khởi hành → Đón tại khách sạn
                </Text>
              </View>
            </View>
            {tour.schedule
              .split("\n")
              .slice(0, showMore.schedule ? undefined : 1)
              .map((item, index) => (
                <View style={styles.itineraryItem} key={index}>
                  <View style={styles.itineraryIcon}>
                    <Ionicons name="time-outline" size={20} color="#555" />
                  </View>
                  <View style={styles.itineraryContent}>
                    <Text style={styles.itineraryText}>{item}</Text>
                  </View>
                </View>
              ))}
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowScheduleModal(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>

            {/* Modal cho lịch trình chi tiết */}
            <SchechuleModal
              visible={showScheduleModal}
              onClose={() => setShowScheduleModal(false)}
              // type="schedule"
              // data={tour}
            />

            {/* Policies */}
            <Text style={styles.sectionTitle}>
              Những yêu cầu đối với khách hàng
            </Text>
            <Text style={styles.description}>{tour.policies}</Text>
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowExtraUserModal(true)}
            >
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>

            <ExtraUserModal
              visible={showExtraUserModal}
              onClose={() => setShowExtraUserModal(false)}
              // type="schedule"
              // data={tour}
            />
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
        </View>
      </SafeAreaView>
    </>
  );
}
