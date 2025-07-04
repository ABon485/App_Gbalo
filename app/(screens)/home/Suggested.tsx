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
} from "react-native";
import { Heart } from "lucide-react-native";
import { TourItem, TourDetail, TourListResponse } from "@/types/tour";
import tourApi from "@/services/tour";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2;

const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Suggested = () => {
  const [tours, setTours] = useState<
    (TourItem & { detail?: TourDetail; images?: string[] })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(4); // Số tour hiển thị ban đầu

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

      const response: TourListResponse = await tourApi.ListTour(1, 20); // Lấy tối đa 20 tour
      const fetchedTours = await Promise.all(
        response.data.datas.map(async (item: any) => {
          let detail: TourDetail | undefined;
          let images: string[] = [];
          try {
            const detailRes = await tourApi.TourDetail(item.id);
            detail = detailRes;
            const imageRes = await fetch(
              `https://files.vbalo.com/list/Tours${item.id}`
            );
            const imageData = await imageRes.json();
            if (imageData.status === "Success" && imageData.data?.length > 0) {
              images = imageData.data;
            }
          } catch (err) {
            console.error(`Lỗi khi preload tour ${item.id}:`, err);
          }
          return {
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            featuredImageUrl: item.featuredImageUrl,
            provinceIds: item.provinceIds,
            provinceName: item.provinceName || "Khác",
            vote: item.vote || 0,
            fromPrice: item.fromPrice || 0,
            isFavorite: favoriteTourIds.includes(String(item.id)),
            ratingCount: item.ratingCount || 0,
            tourExtraServices: [],
            detail,
            images,
          };
        })
      );

      setTours(fetchedTours);
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: string }).message)
          : "Không thể tải danh sách tour.";
      setError(errorMessage);
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
        router.push("/(auths)/(Login)/login");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData.profile?.id || parsedData.id;
      const token = parsedData.token;

      if (!userId || !token) {
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
      } else {
        await tourApi.postFavorite(userId, Number(id));
      }

      const favoriteRes = await tourApi.getFavorite(userId);
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify(favoriteRes.data.datas)
      );
    } catch (err) {
      console.error("Lỗi khi lưu yêu thích:", err);
      setTours((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
      );
    }
  };

  const handleCardPress = async (
    tour: TourItem & { detail?: TourDetail; images?: string[] }
  ) => {
    try {
      await AsyncStorage.setItem("selectedTour", JSON.stringify(tour));
      router.push({
        pathname: "/(screens)/detail/[detailID]",
        params: {
          detailID: tour.id,
          provinceIds: JSON.stringify(tour.provinceIds),
        },
      });
    } catch (error) {
      console.error("Lỗi khi lưu tour được chọn:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, tours.length));
  };

  const renderTourItem = ({
    item,
  }: {
    item: TourItem & { detail?: TourDetail; images?: string[] };
  }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
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
            fill={item.isFavorite ? "#FF3B30" : "#819A91"}
            stroke={item.isFavorite ? "#EBFFD8" : "#1A1A1A"}
            strokeWidth={1}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={styles.ratingContainer}>
        <FontAwesome
          name="star"
          size={12}
          color={item.vote > 0 ? "#F24E1E" : "#999999"}
        />
        <Text style={styles.reviews}>{item.vote}</Text>
        <Text style={styles.reviews}>({item.ratingCount})</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={tours.slice(0, visibleCount)}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
      />
      {visibleCount < tours.length && (
        <TouchableOpacity
          onPress={handleLoadMore}
          style={{
            alignSelf: "center",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "red", textDecorationLine: "underline" }}>Xem thêm</Text>
        </TouchableOpacity>
      )}
    </View>
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
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  reviews: {
    marginLeft: 3,
    fontSize: 10,
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
});

export default Suggested;
