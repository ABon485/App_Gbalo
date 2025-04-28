"use client";

import { useState, useEffect } from "react";
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

// Get screen width to calculate item width
const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2; // 2 items per row with 40px total padding

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TourListScreen = () => {
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  // Function to fetch all tours from API across all pages
  const fetchTours = async () => {
    try {
      setLoading(true);
      let allTours: TourItem[] = [];
      let currentPage = 1;
      let totalPages = 20;

      // Loop through all pages
      while (currentPage <= totalPages) {
        const response: TourListResponse = await tourApi.ListTour(); 
        const fetchedTours: TourItem[] = response.data.datas.map(
          (item: any) => ({
            id: item.id.toString(),
            name: item.name,
            slug: item.slug,
            featuredImageUrl: item.featuredImageUrl,
            provinceId: item.provinceId,
            vote: item.vote || 0,
            fromPrice: item.fromPrice || 0,
            isFavorite: false,
          })
        );

        allTours = [...allTours, ...fetchedTours];
        totalPages = response.data.totalPages;
        currentPage += 1;
      }

      setTours(allTours);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setTours(
      tours.map((tour) =>
        tour.id === id ? { ...tour, isFavorite: !tour.isFavorite } : tour
      )
    );
  };

  const handleCardPress = (id: string) => {
    router.push({
      pathname: "/(screens)/[detailID]",
      params: { detailID: id },
    });
  };

  // Render each tour item
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
        <Text style={styles.reviews}>({item.vote})</Text>
      </View>
      <Text style={styles.price}>Từ {formatPrice(item.fromPrice)}đ/Người</Text>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchTours} style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={showAll ? tours : tours.slice(0, 4)}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          !showAll && tours.length > 4 ? (
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#FF3B30",
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF9500",
    borderRadius: 8,
    alignSelf: "center",
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter-Medium",
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
