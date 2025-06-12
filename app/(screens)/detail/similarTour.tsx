import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Heart } from "lucide-react-native";
import { TourItem, TourListResponse } from "@/types/tour";
import tourApi from "@/services/tour";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";
import { useFocusEffect } from "@react-navigation/native";

interface SimilarTourProps {
  provinceIds: number[];
  tourId: number;
}

const { width } = Dimensions.get("window");
const itemWidth = (width - 30) / 2;

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const SimilarTour: React.FC<SimilarTourProps> = ({ provinceIds, tourId }) => {
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

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
            featuredImageUrl:
              item.featuredImageUrl || "https://via.placeholder.com/150",
            provinceIds: Array.isArray(item.provinceIds)
              ? item.provinceIds.map((id: string | number) => Number(id))
              : item.provinceId
              ? [Number(item.provinceId)]
              : [],
            provinceName: item.provinceName || "",
            tourExtraServices: item.tourExtraServices || [],
            vote: item.vote || 0,
            ratingCount:item.ratingCount || 0,
            fromPrice: item.fromPrice || 0,
            isFavorite: favoriteTourIds.includes(String(item.id)),
          })
        );

        allTours = [...allTours, ...fetchedTours];
        totalPages = response.data.totalPages || 1;
        currentPage += 1;
      }

      let filteredTours: TourItem[] = [];
      if (provinceIds.length > 0) {
        filteredTours = allTours
          .filter((tour) => {
            const isCurrentTour = Number(tour.id) === Number(tourId);
            if (isCurrentTour) return false;
            return Array.isArray(tour.provinceIds)
              ? tour.provinceIds.some((id) => provinceIds.includes(id))
              : provinceIds.includes(Number(tour.provinceIds));
          })
          .slice(0, 5);
      } else {
        filteredTours = allTours
          .filter((tour) => Number(tour.id) !== Number(tourId))
          .sort((a, b) => b.vote - a.vote)
          .slice(0, 5);
      }

      if (filteredTours.length === 0) {
        setError("Không tìm thấy tour tương tự nào");
      } else {
        setTours(filteredTours);
      }
    } catch (err) {
      console.error("Lỗi khi lấy tour tương tự:", err);
      if (err instanceof Error) {
        setError(err.message || "Không tải được các tour tương tự");
      } else {
        setError("Không tải được các tour tương tự");
      }
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
  }, [provinceIds, tourId]);

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
      params: {
        detailID: id,
        provinceIds: JSON.stringify(provinceIds.length > 0 ? provinceIds : []),
      },
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
            setTours((prevTours) =>
              prevTours.map((tour) =>
                tour.id === item.id
                  ? {
                      ...tour,
                      featuredImageUrl: "https://via.placeholder.com/150",
                    }
                  : tour
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
          size={15}
          color={item.vote > 0 ? "#F24E1E" : "#999999"}
        />
        <Text style={styles.reviews}>({item.vote})</Text>
        <Text style={styles.reviews}>({item.ratingCount})</Text>
      </View>
      <Text style={styles.price}>
        Từ <Text style={styles.bold}>{formatPrice(item.fromPrice)}đ</Text>/Người
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải các tour tương tự...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (tours.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy tour tương tự nào.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        horizontal
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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    width: itemWidth,
    marginRight: 10,
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
    fontFamily: "Inter-Medium",
    marginLeft:3,
  },
  price: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  bold: {
    fontWeight: "bold",
  },

  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#FF3B30",
    fontFamily: "Inter-Medium",
  },
});

export default SimilarTour;
