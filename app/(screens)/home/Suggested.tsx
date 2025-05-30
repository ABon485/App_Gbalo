"use client";

import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Heart } from "lucide-react-native";
import { TourItem, TourListResponse } from "@/types/tour";
import tourApi from "@/services/tour";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2;

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TourListScreen = () => {
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchTours = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("data");
      let userId: string | null = null;
      let token: string | null = null;
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        userId = parsedData.profile?.id || parsedData.id;
        token = parsedData.token;
      }

      let favoriteTourIds: string[] = [];
      if (userId && token) {
        const favoriteRes = await tourApi.getFavorite(Number(userId));
        favoriteTourIds = favoriteRes.data.datas.map((tour: any) =>
          String(tour.id)
        );
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(favoriteRes.data.datas)
        );
      }

      let allTours: TourItem[] = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response: TourListResponse = await tourApi.ListTour(
          currentPage,
          20
        );
        const fetchedTours: TourItem[] = response.data.datas.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            featuredImageUrl: item.featuredImageUrl,
            provinceIds: item.provinceIds,
            provinceName: item.provinceName || "Khác",
            vote: item.vote || 0,
            fromPrice: item.fromPrice || 0,
            isFavorite: favoriteTourIds.includes(String(item.id)),
            tourExtraServices: [],
          })
        );

        allTours = [...allTours, ...fetchedTours];
        totalPages = response.data.totalPages;
        currentPage += 1;
      }

      setTours(allTours);
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: string }).message)
          : "Không thể tải danh sách tour.";
      setError(errorMessage);
      showToast({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const updateFavoriteStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) return;
      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;
      const cachedFavorites = await AsyncStorage.getItem("favorites");
      const favorites = cachedFavorites ? JSON.parse(cachedFavorites) : [];
      const favoriteTourIds = favorites.map((tour: any) => String(tour.id));

      setTours((prev) =>
        prev.map((tour) => ({
          ...tour,
          isFavorite: favoriteTourIds.includes(tour.id),
        }))
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateFavoriteStatus();
    }, [])
  );

  const toggleFavorite = async (id: string) => {
    try {
      const storedData = await AsyncStorage.getItem("data");
      if (!storedData) {
        showToast({
          type: "error",
          message: "Vui lòng đăng nhập để lưu tour yêu thích.",
        });
        router.push("/(auths)/(Login)/login");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;
      const token = parsedData.token;

      if (!userId || !token) {
        showToast({
          type: "error",
          message:
            "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
        router.push("/(auths)/(Login)/login");
        return;
      }

      const tour = tours.find((t) => t.id === id);
      const isCurrentlyFavorite = tour?.isFavorite;

      setTours((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
      );

      if (isCurrentlyFavorite) {
        await tourApi.deleteFavorite(userId, Number(id));
        showToast({
          type: "success",
          message: "Đã xóa khỏi danh sách yêu thích.",
        });
      } else {
        await tourApi.postFavorite(userId, Number(id));
        showToast({
          type: "success",
          message: "Đã thêm vào danh sách yêu thích.",
        });
      }

      const favoriteRes = await tourApi.getFavorite(userId);
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify(favoriteRes.data.datas)
      );
    } catch (err) {
      console.error("Lỗi khi lưu yêu thích:", err);
      showToast({
        type: "error",
        message: "Không thể cập nhật tour yêu thích. Vui lòng thử lại.",
      });
      setTours((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
      );
    }
  };

  const handleCardPress = (id: string) => {
    router.push({
      pathname: "/(screens)/detail/[detailID]",
      params: { detailID: id },
    });
  };

  const renderTourItem = ({ item }: { item: TourItem }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item.id)}
      style={styles.itemContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.featuredImageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setTours(
              tours.map((tour) =>
                tour.id === item.id ? { ...tour, featuredImageUrl: "" } : tour
              )
            );
          }}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart
            size={22}
            color="#fff"
            fill={item.isFavorite ? "#FF3B30" : "transparent"}
            stroke={item.isFavorite ? "#FF3B30" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={styles.ratingContainer}>
        <AntDesign
          name="staro"
          size={15}
          color={item.vote > 0 ? "#FF9500" : "#999999"}
        />
        <Text style={styles.reviews}>{item.vote}</Text>
        <Text style={styles.reviews}>{item.provinceName}</Text>
      </View>
      <View>
        <Text style={styles.price}>
          Từ{" "}
          <Text style={styles.priceHighlight}>
            {formatPrice(item.fromPrice)}/đ
          </Text>{" "}
          người
        </Text>
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
      <FlatList
        data={showAll ? tours : tours.slice(0, 6)}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        ListFooterComponent={
          !showAll && tours.length > 6 ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setShowAll(true)}
            >
              <Text style={styles.loadMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 10,
    paddingHorizontal: 10,
  },
  columnWrapper: {
    paddingLeft: 10,
  },
  itemContainer: {
    width: itemWidth,
    margin: 5,
    marginBottom: 15,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
  title: {
    fontSize: 12,
    marginBottom: 3,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  reviews: {
    fontSize: 10,
    color: "#8E8E93",
    fontFamily: "Inter-Medium",
  },
  price: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  priceHighlight: {
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  loadMoreText: {
    color: "#FF9500",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});

export default TourListScreen;
