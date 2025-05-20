import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { TourItem, TourListResponse } from '@/types/tour';
import tourApi from '@/services/tour';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SimilarTourProps {
  provinceIds: number[]; 
  tourId: number; 
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2;

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const SimilarTour: React.FC<SimilarTourProps> = ({ provinceIds, tourId }) => {
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Log để kiểm tra provinceIds và tourId
  useEffect(() => {
    console.log('SimilarTour nhận provinceIds:', provinceIds, 'tourId:', tourId);
  }, [provinceIds, tourId]);

  // Hàm lấy và lọc tour
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      let allTours: TourItem[] = [];
      let currentPage = 1;
      let totalPages = 1;

      // Gọi API để lấy danh sách tour
      while (currentPage <= totalPages) {
        const response: TourListResponse = await tourApi.ListTour(currentPage, 20);
        const fetchedTours: TourItem[] = response.data.datas.map((item: any) => ({
          id: item.id.toString(), 
          name: item.name,
          slug: item.slug,
          featuredImageUrl: item.featuredImageUrl || 'https://via.placeholder.com/150',
          provinceIds: Array.isArray(item.provinceIds)
            ? item.provinceIds.map((id: string | number) => Number(id))
            : item.provinceId
              ? [Number(item.provinceId)]
              : [],
          vote: item.vote || 0,
          fromPrice: item.fromPrice || 0,
          isFavorite: false,
        }));

        allTours = [...allTours, ...fetchedTours];
        totalPages = response.data.totalPages || 1;
        currentPage += 1;
      }

      console.log('Tổng số tour lấy được:', allTours.length);

      // Lọc tour
      let filteredTours: TourItem[] = [];
      if (provinceIds.length > 0) {
        filteredTours = allTours
          .filter((tour) => {
            const isCurrentTour = Number(tour.id) === Number(tourId);
            if (isCurrentTour) {
              console.log(`Loại bỏ tour có id=${tour.id} vì trùng với tourId=${tourId}`);
              return false;
            }
            return tour.provinceIds.some((id) => provinceIds.includes(id));
          })
          .slice(0, 5); 
      } else {
        console.warn('Không có provinceIds, lấy 5 tour phổ biến');
        filteredTours = allTours
          .filter((tour) => Number(tour.id) !== Number(tourId)) 
          .sort((a, b) => b.vote - a.vote) 
          .slice(0, 5); 
      }

      console.log('Tour sau khi lọc:', filteredTours.map((tour) => tour.id));

      if (filteredTours.length === 0) {
        setError('Không tìm thấy tour tương tự nào');
      } else {
        setTours(filteredTours);
      }
    } catch (err: any) {
      console.error('Lỗi khi lấy tour tương tự:', err);
      setError(err.message || 'Không tải được các tour tương tự');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [provinceIds, tourId]);

  const toggleFavorite = (id: string) => {
    setTours((prevTours) =>
      prevTours.map((tour) =>
        tour.id === id ? { ...tour, isFavorite: !tour.isFavorite } : tour
      )
    );
  };

  const handleCardPress = (id: string) => {
    router.push({
      pathname: '/(screens)/detail/[detailID]',
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
                  ? { ...tour, featuredImageUrl: 'https://via.placeholder.com/150' }
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
            fill={item.isFavorite ? '#FF3B30' : 'transparent'}
            stroke={item.isFavorite ? '#FF3B30' : '#fff'}
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
          color={item.vote > 0 ? '#FF9500' : '#999999'}
        />
        <Text style={styles.reviews}>({item.vote})</Text>
      </View>
      <Text style={styles.price}>Từ {formatPrice(item.fromPrice)}đ/Người</Text>
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
        <Text style={styles.errorText}>Không tìm thấy tour tương tự nào</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemContainer: {
    width: itemWidth,
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    marginBottom: 3,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  reviews: {
    fontSize: 10,
    color: '#8E8E93',
    fontFamily: 'Inter-Medium',
  },
  price: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#FF3B30',
    fontFamily: 'Inter-Medium',
  },
});

export default SimilarTour;