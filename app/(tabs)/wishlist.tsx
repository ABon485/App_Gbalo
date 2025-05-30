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
import { useToast } from "@/context/ToastContext";
import { useFocusEffect } from "@react-navigation/native";

const formatPrice = (price: number): string => {
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
  }

  interface WishlistSection {
    location: string;
    count: number;
    data: WishlistItem[];
  }

  const [wishlistItems, setWishlistItems] = useState<WishlistSection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        showToast({
          type: "error",
          message: "Vui lòng đăng nhập để xem danh sách yêu thích.",
        });
        router.push("/");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;

      let rawTours = [];
      const cachedFavorites = await AsyncStorage.getItem("favorites");
      if (cachedFavorites && cachedFavorites.length > 0) {
        rawTours = JSON.parse(cachedFavorites);
      } else {
        const res = await tourApi.getFavorite(userId);
        rawTours = res.data.datas;
        await AsyncStorage.setItem("favorites", JSON.stringify(rawTours));
      }

      if (!rawTours || rawTours.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      interface Tour {
        id: number;
        name: string;
        featuredImageUrl: string;
        vote?: number;
        fromPrice: number;
        provinceName?: string;
      }

      const grouped = (rawTours as Tour[]).reduce((acc: { [provinceName: string]: WishlistItem[] }, tour) => {
        const provinceName = tour.provinceName || "Không xác định";
        if (!acc[provinceName]) {
          acc[provinceName] = [];
        }
        acc[provinceName].push({
          id: String(tour.id),
          title: tour.name,
          image: { uri: tour.featuredImageUrl },
          rating: tour.vote || 4.5,
          reviews: 100,
          provinceName,
          price: tour.fromPrice,
          isFavorite: true,
          location: provinceName,
        });
        return acc;
      }, {} as { [provinceName: string]: WishlistItem[] });

      const sections = Object.entries(grouped).map(([province, data]) => ({
        location: province,
        count: data.length,
        data,
      }));

      setWishlistItems(sections);
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích:", err);
      showToast({
        type: "error",
        message: "Không thể tải danh sách yêu thích. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        showToast({
          type: "error",
          message: "Vui lòng đăng nhập để xóa tour yêu thích.",
        });
        router.push("/");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;

      await tourApi.deleteFavorite(userId, Number(id));
      showToast({
        type: "success",
        message: "Đã xóa khỏi danh sách yêu thích.",
      });

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
      showToast({
        type: "error",
        message: "Không thể xóa tour yêu thích. Vui lòng thử lại.",
      });
    }
  };

  const navigateToDetail = (id: string) => {
    router.push({
      pathname: "/(screens)/detail/[detailID]",
      params: { detailID: id },
    });
  };

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {section.location} ({section.count})
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetail(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingIcon}>★</Text>
            <Text style={styles.rating}>{item.rating}/5</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>Từ {formatPrice(item.price)}đ/ Người</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Heart size={22} color="#fff" fill="#FF3B30" stroke="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yêu thích</Text>
      </View>
      <SectionList
        sections={wishlistItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
        stickySectionHeadersEnabled={false}
      />
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
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    marginBottom: 6,
    fontFamily: "Inter-Medium",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingIcon: {
    color: "#FF9500",
    fontSize: 10,
    marginRight: 2,
  },
  rating: {
    fontSize: 12,
    color: "#FF9500",
    fontFamily: "Inter-Medium",
  },
  reviews: {
    fontSize: 12,
    color: "#8E8E93",
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
});

export default WishlistScreen;
