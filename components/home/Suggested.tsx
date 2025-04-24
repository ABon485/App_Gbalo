"use client";

import { useState } from "react";
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
import { TourItem } from "@/types/tour";
import { useRouter } from "expo-router"; // Sử dụng expo-router để điều hướng

// Get screen width to calculate item width
const { width } = Dimensions.get("window");
const itemWidth = (width - 40) / 2; // 2 items per row with 40px total padding

// Update the sample data to use local image paths
const tourData: TourItem[] = [
  {
    id: "1",
    title: "Tour sớm đến đói BanaHill/Cầu vàng",
    image: require("@/assets/images/home/Property1.png"),
    rating: 4.5,
    reviews: 848,
    price: 1234567,
    isFavorite: false,
  },
  {
    id: "2",
    title: "Tour sớm đến đói BanaHill/Cầu vàng",
    image: require("@/assets/images/home/Property1.png"),
    rating: 4.5,
    reviews: 848,
    price: 1234567,
    isFavorite: true,
  },
  {
    id: "3",
    title: "Tour sớm đến đói BanaHill/Cầu vàng",
    image: require("@/assets/images/home/Property1.png"),
    rating: 4.5,
    reviews: 848,
    price: 1234567,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Tour sớm đến đói BanaHill/Cầu vàng",
    image: require("@/assets/images/home/Property1.png"),
    rating: 4.5,
    reviews: 848,
    price: 1234567,
    isFavorite: false,
  },
];

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const TourListScreen = () => {
  const [tours, setTours] = useState<TourItem[]>(tourData);
  const router = useRouter(); // Khởi tạo router

  const toggleFavorite = (id: string) => {
    setTours(
      tours.map((tour) =>
        tour.id === id ? { ...tour, isFavorite: !tour.isFavorite } : tour
      )
    );
  };

  const handleCardPress = (id: string) => {
    router.push(`/[detailID]?detailID=${id}`);
  };

  const renderTourItem = ({ item }: { item: TourItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleCardPress(item.id)}
    >
      {/* Image container with heart icon */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
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

      {/* Simple text below image */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>★ {item.rating}</Text>
        <Text style={styles.reviews}>({item.reviews})</Text>
      </View>
      <Text style={styles.price}>Từ {formatPrice(item.price)}đ/Người</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
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
    height: 150,
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
  rating: {
    fontSize: 10,
    color: "#FF9500",
    marginRight: 4,
    fontFamily: "Inter-Medium",
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
});

export default TourListScreen;
