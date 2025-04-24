import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native"
import { Star } from "lucide-react-native"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.35

// Define TypeScript interfaces for our props
interface DestinationCardProps {
  image: any
  location: string
  rating: string
  distance: string
  isPromo?: boolean
}

interface DestinationItem {
  id: string
  image: any
  location: string
  rating: string
  distance: string
  isPromo?: boolean
}

const DestinationCard = ({ image, location, rating, distance, isPromo = false }: DestinationCardProps) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.locationText}>{location}</Text>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFC107" style={styles.starIcon} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <Text style={styles.distanceText}>{distance}</Text>
      </View>
      {isPromo && (
        <View style={styles.promoTag}>
          <Text style={styles.promoText}>Sale</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const DestinationSection = () => {
  // Sample data - in a real app, this would come from an API or props
  const destinations: DestinationItem[] = [
    {
      id: "1",
      image: require("@/assets/images/home/Property1.png"),
      location: "Hà Nội",
      rating: "4.5 (120 đánh giá)",
      distance: "2.5 km từ bạn",
      isPromo: true,
    },
    {
      id: "2",
      image: require("@/assets/images/home/Property1.png"),
      location: "Hà Nội",
      rating: "4.7 (85 đánh giá)",
      distance: "3.0 km từ bạn",
    },
    {
      id: "3",
      image: require("@/assets/images/home/Property1.png"),
      location: "Hà Nội",
      rating: "4.8 (95 đánh giá)",
      distance: "3.5 km từ bạn",
    },
    {
      id: "4",
      image: require("@/assets/images/home/Property1.png"),
      location: "Hà Nội",
      rating: "4.6 (110 đánh giá)",
      distance: "4.0 km từ bạn",
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Điểm đến hấp dẫn</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {destinations.map((item) => (
          <DestinationCard
            key={item.id}
            image={item.image}
            location={item.location}
            rating={item.rating}
            distance={item.distance}
            isPromo={item.isPromo}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
    marginBottom: 10,
  },
  card: {
    width: cardWidth,
    marginRight: 12,
    borderRadius: 12, // Bo góc toàn bộ card
    backgroundColor: "transparent", // Xóa nền trắng của card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "visible", // Đảm bảo nội dung không bị cắt
  },
  cardImage: {
    width: "100%",
    height: cardWidth * 0.9, // Tăng chiều cao ảnh để chiếm toàn bộ không gian
    borderRadius: 12, // Bo góc toàn bộ ảnh
    borderBottomLeftRadius: 12, // Giữ bo góc dưới
    borderBottomRightRadius: 12,
  },
  cardContent: {
    position: "absolute", // Đặt nội dung chồng lên ảnh
    top: "60%", // Đưa nội dung vào giữa theo chiều dọc
    left: 0,
    right: 0,
    transform: [{ translateY: -20 }], // Điều chỉnh vị trí chính xác giữa
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Nền trắng với độ trong suốt nhẹ
    padding: 4,
    borderRadius: 8, // Bo góc nhẹ cho nội dung
    marginHorizontal:20, // Khoảng cách hai bên để không sát mép
    alignItems: "center", // Căn trái nội dung
  },
  locationText: {
    fontSize: 12, // Tăng kích thước chữ tiêu đề
    fontFamily: "Inter-Medium",
    marginBottom: 4,
    color: "#000", // Đảm bảo chữ màu đen
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 8,
    color: "#666",
    fontFamily: "Inter-Medium",
  },
  distanceText: {
    fontSize: 10,
    color: "#666",
    fontFamily: "Inter-Medium",
  },
  promoTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FF5722",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  promoText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Inter-Medium",
  },
});
export default DestinationSection
