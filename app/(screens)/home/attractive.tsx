import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ProvinceType } from "@/types/tour"; 
import tourService from "@/services/tour"; 

const { width } = Dimensions.get("window");
const cardWidth = width * 0.35;

const truncateDescription = (text: string | undefined, wordLimit: number) => {
  if (!text) return "No description available";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const DestinationCard = ({ image, name, description }: ProvinceType) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={image ? { uri: image } : require("@/assets/images/home/Property1.png")}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.locationText}>{name}</Text>
        <Text style={styles.distanceText}>
          {truncateDescription(description, 4)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const DestinationSection = () => {
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data: ProvinceType[] = await tourService.getProvince(); // Call getProvince as a method
        setProvinces(data);
      } catch (err) {
        setError("Failed to fetch provinces. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Điểm đến hấp dẫn</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Điểm đến hấp dẫn</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Điểm đến hấp dẫn</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {provinces.map((item) => (
          <DestinationCard
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            description={item.description}
          />
        ))}
      </ScrollView>
    </View>
  );
};

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
    borderRadius: 12,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "visible",
  },
  cardImage: {
    width: "100%",
    height: cardWidth * 0.9,
    borderRadius: 12,
  },
  cardContent: {
    position: "absolute",
    top: "60%",
    left: 0,
    right: 0,
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fixed syntax error
    padding: 4,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    marginBottom: 4,
    color: "#000",
  },
  distanceText: {
    fontSize: 10,
    color: "#666",
    fontFamily: "Inter-Medium",
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
  errorText: {
    fontSize: 12,
    color: "red",
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
});

export default DestinationSection;