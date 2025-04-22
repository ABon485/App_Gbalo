"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, SectionList } from "react-native"
import { Heart } from "lucide-react-native"
import type { TourItem } from "@/types/tour"
import { useRouter } from "expo-router"

// Sample data grouped by location
const wishlistData = [
  {
    location: "Đà Nẵng",
    count: 2,
    data: [
      {
        id: "1",
        title: "Tour sớm đến đói BanaHill/Cầu vàng",
        image: require("@/assets/images/home/Property1.png"),
        rating: 4.95,
        reviews: 648,
        price: 1234567,
        isFavorite: true,
        location: "Đà Nẵng",
      },
      {
        id: "2",
        title: "Tour sớm đến đói BanaHill/Cầu vàng",
        image: require("@/assets/images/home/Property1.png"),
        rating: 4.95,
        reviews: 648,
        price: 1234567,
        isFavorite: true,
        location: "Đà Nẵng",
      },
    ],
  },
  {
    location: "Hà Nội",
    count: 2,
    data: [
      {
        id: "3",
        title: "Tour sớm đến đói BanaHill/Cầu vàng",
        image: require("@/assets/images/home/Property1.png"),
        rating: 4.95,
        reviews: 648,
        price: 1234567,
        isFavorite: true,
        location: "Hà Nội",
      },
      {
        id: "4",
        title: "Tour sớm đến đói BanaHill/Cầu vàng",
        image: require("@/assets/images/home/Property1.png"),
        rating: 4.95,
        reviews: 648,
        price: 1234567,
        isFavorite: true,
        location: "Hà Nội",
      },
    ],
  },
]

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const WishlistScreen = () => {
  const [wishlistItems] = useState(wishlistData)
  const router = useRouter()

  const navigateToDetail = (itemId: string) => {
    // Navigate to detail page with the item ID
    // router.push(`/tour/${itemId}`)
  }

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {section.location} ({section.count})
      </Text>
    </View>
  )

  const renderItem = ({ item }: { item: TourItem & { location: string }; index: number; section: any }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item.id)} activeOpacity={0.7}>
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
            <View style={styles.favoriteButton}>
              <Heart size={22} color="#fff" fill="#FF3B30" stroke="#FF3B30" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
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
  )
}

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
})

export default WishlistScreen
