import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { ProvinceType } from "@/types/tour";
import tourService from "@/services/tour";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.35;

const truncateDescription = (text: string | undefined, wordLimit: number) => {
  if (!text) return "No description available";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const DestinationCard = ({ id, image, name, description }: ProvinceType) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: '/(screens)/search/searchResult',
      params: {
        selectedProvinceId: id.toString(),
        searchQuery: name,
      },
    });
  };
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={
          image ? { uri: image } : require("@/assets/images/home/Property1.png")
        }
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
        const data: ProvinceType[] = await tourService.getProvince();
        setProvinces(data.slice(0, 6)); // 👈 Hiển thị 6 province đầu tiên
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
      <FlatList
        data={provinces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DestinationCard
            id={item.id}
            image={item.image}
            name={item.name}
            description={item.description}
            type={item.type}

          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true} // ✅ fix chính
      />
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  errorText: {
    fontSize: 12,
    color: "red",
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
});

export default DestinationSection;
