"use client";

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  SectionList,
  StyleSheet,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import tourApi from "@/services/tour";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useToast } from "@/context/ToastContext";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { TourDetail } from "@/types/tour";

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const WishlistScreen = () => {
  interface WishlistItem {
    id: string;
    title: string;
    image: { uri: string };
    rating: number;
    reviews: number;
    provinceName: string;
    price: number;
    isFavorite: boolean;
    location: string;
    detail?: TourDetail;
    images?: string[];
    provinceIds?: number[];
  }

  interface WishlistSection {
    location: string;
    count: number;
    data: WishlistItem[];
  }

  const [wishlistItems, setWishlistItems] = useState<WishlistSection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const { showToast } = useToast();

  const loadCachedFavorites = async () => {
    try {
      const cachedFavorites = await AsyncStorage.getItem("favorites");
      if (cachedFavorites && cachedFavorites.length > 0) {
        const rawTours = JSON.parse(cachedFavorites);

        interface Tour {
          id: number;
          name: string;
          featuredImageUrl: string;
          vote?: number;
          fromPrice?: number;
          provinceName?: string;
          provinceIds?: number[];
          detail?: TourDetail;
          images?: string[];
        }

        const fetchedTours = rawTours.map((tour: Tour) => ({
          id: String(tour.id),
          title: tour.name,
          image: { uri: tour.featuredImageUrl },
          rating: tour.vote || 0,
          reviews: 100,
          provinceName: tour.provinceName || "Không xác định",
          price: tour.fromPrice || 0,
          isFavorite: true,
          location: tour.provinceName || "Không xác định",
          detail: tour.detail,
          images: tour.images || [],
          provinceIds: tour.provinceIds || [],
        }));

        const grouped = fetchedTours.reduce(
          (
            acc: { [provinceName: string]: WishlistItem[] },
            tour: WishlistItem
          ) => {
            const provinceName = tour.provinceName;
            if (!acc[provinceName]) {
              acc[provinceName] = [];
            }
            acc[provinceName].push(tour);
            return acc;
          },
          {} as { [provinceName: string]: WishlistItem[] }
        );

        const sections = Object.entries(grouped).map(([province, data]) => ({
          location: province,
          count: (data as WishlistItem[]).length,
          data: data as WishlistItem[],
        }));

        setWishlistItems(sections);
      }
    } catch (err) {
      console.error("Lỗi khi tải cache yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        // showToast({
        //   type: "error",
        //   message: "Vui lòng đăng nhập để xem danh sách yêu thích.",
        // });
        router.push("/");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;

      let rawTours = [];
      const res = await tourApi.getFavorite(userId);
      rawTours = res.data.datas;
      await AsyncStorage.setItem("favorites", JSON.stringify(rawTours));

      if (!rawTours || rawTours.length === 0) {
        setWishlistItems([]);
        return;
      }

      interface Tour {
        id: number;
        name: string;
        featuredImageUrl: string;
        vote?: number;
        fromPrice?: number;
        provinceName?: string;
        provinceIds?: number[];
      }

      const fetchedTours = await Promise.all(
        (rawTours as Tour[]).map(async (tour) => {
          let detail: TourDetail | undefined;
          let images: string[] = [];
          try {
            const detailRes = await tourApi.TourDetail(tour.id);
            detail = detailRes;
            const imageRes = await fetch(
              `https://files.vbalo.com/list/Tours${tour.id}`
            );
            const imageData = await imageRes.json();
            if (imageData.status === "Success" && imageData.data?.length > 0) {
              images = imageData.data;
            }
          } catch (err) {
            console.error(`Lỗi khi preload tour ${tour.id}:`, err);
          }
          return {
            id: String(tour.id),
            title: tour.name,
            image: { uri: tour.featuredImageUrl },
            rating: tour.vote || 0,
            reviews: 100,
            provinceName: tour.provinceName || "Không xác định",
            price: tour.fromPrice || 0,
            isFavorite: true,
            location: tour.provinceName || "Không xác định",
            detail,
            images,
            provinceIds: tour.provinceIds || [],
          };
        })
      );

      const grouped = fetchedTours.reduce(
        (acc: { [provinceName: string]: WishlistItem[] }, tour) => {
          const provinceName = tour.provinceName;
          if (!acc[provinceName]) {
            acc[provinceName] = [];
          }
          acc[provinceName].push(tour);
          return acc;
        },
        {} as { [provinceName: string]: WishlistItem[] }
      );

      const sections = Object.entries(grouped).map(([province, data]) => ({
        location: province,
        count: data.length,
        data,
      }));

      setWishlistItems(sections);
      // Cập nhật cache với dữ liệu mới
      await AsyncStorage.setItem("favorites", JSON.stringify(fetchedTours));
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích:", err);
      // showToast({
      //   type: "error",
      //   message: "Không thể tải danh sách yêu thích. Vui lòng thử lại.",
      // });
    }
  };

  useEffect(() => {
    // Tải dữ liệu cache ngay lập tức
    loadCachedFavorites();
    // Cập nhật dữ liệu từ API trong nền
    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Cập nhật lại khi màn hình được focus
      fetchFavorites();
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        // showToast({
        //   type: "error",
        //   message: "Vui lòng đăng nhập để xóa tour yêu thích.",
        // });
        router.push("/");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;

      await tourApi.deleteFavorite(userId, Number(id));
      // showToast({
      //   type: "success",
      //   message: "Đã xóa khỏi danh sách yêu thích.",
      // });

      const cachedFavorites = await AsyncStorage.getItem("favorites");
      let favorites = cachedFavorites ? JSON.parse(cachedFavorites) : [];
      favorites = favorites.filter(
        (tour: { id: number }) => tour.id !== Number(id)
      );
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));

      setWishlistItems((prev) =>
        prev
          .map((section) => ({
            ...section,
            data: section.data.filter((item) => item.id !== id),
          }))
          .filter((section) => section.data.length > 0)
      );
    } catch (err) {
      console.error("Lỗi khi xóa yêu thích:", err);
      // showToast({
      //   type: "error",
      //   message: "Không thể xóa tour yêu thích. Vui lòng thử lại.",
      // });
    }
  };

  const navigateToDetail = async (item: WishlistItem) => {
    try {
      await AsyncStorage.setItem("selectedTour", JSON.stringify(item));
      router.push({
        pathname: "/(screens)/detail/[detailID]",
        params: {
          detailID: item.id,
          provinceIds: JSON.stringify(item.provinceIds || []),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lưu tour được chọn:", error);
      // showToast({ type: "error", message: "Không thể mở chi tiết tour." });
    }
  };

  const renderSectionHeader = ({ section }: { section: WishlistSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {section.location} ({section.count})
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <FontAwesome
              name="star"
              size={12}
              color={item.rating > 0 ? "#F24E1E" : "#999999"}
            />
            <Text style={styles.rating}>{item.rating}/5</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
          <Text style={styles.location}>{item.location}</Text>
          <View>
            <Text style={styles.price}>
              Từ{" "}
              <Text style={styles.priceHighlight}>
                {formatPrice(item.price)}/đ
              </Text>{" "}
              người
            </Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Heart
              size={22}
              color="#fff"
              fill="#FF3B30"
              stroke="#EBFFD8"
              strokeWidth={1}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yêu thích</Text>
      </View>

      {wishlistItems.length === 0 && !loading ? (
        <View style={styles.noOrderContainer}>
          <Image
            source={require("@/assets/images/NoFavourist.png")}
            style={styles.noOrderImage}
          />
          <Text style={styles.noOrderText}>Bạn chưa có tour yêu thích nào</Text>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <SectionList
          sections={wishlistItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter-Bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Inter-SemiBold",
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContent: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    overflow: "hidden",
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
    fontFamily: "Inter-Medium",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    marginLeft: 3,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "Inter-Medium",
  },
  location: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
    fontFamily: "Inter-Medium",
  },
  price: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Inter-Medium",
  },
  priceHighlight: {
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 50,
  },
  noOrderImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  noOrderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
});

export default WishlistScreen;
