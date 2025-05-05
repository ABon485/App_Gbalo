import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import tourApi from '@/services/tour';
import { ProvinceType, TourItem } from '@/types/tour';
import { Heart,SlidersHorizontal  } from 'lucide-react-native';


const SearchTour = () => {
  const [activeTab, setActiveTab] = useState('Tour');
  const [province, setProvince] = useState<ProvinceType[]>([]);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [allTours, setAllTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchProvincesAndTours = async () => {
      try {
        setLoading(true);
        const responseProvinces = await tourApi.getProvince();
        setProvince(
          responseProvinces.map((province: ProvinceType) => ({
            ...province,
            id: String(province.id),
          }))
        );

        const responseTours = await tourApi.ListTour(1, 100);
        const fetchedTours: TourItem[] = responseTours.data.datas.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          slug: item.slug,
          featuredImageUrl: item.featuredImageUrl || 'default_image_url',
          vote: item.vote || 0,
          fromPrice: item.fromPrice || 0,
          isFavorite: false,
          provinceIds: item.provinceIds || [],
        }));

        setAllTours(fetchedTours);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchProvincesAndTours();
  }, []);

  const searchTours = (provinceId: string, keyword: string) => {
    try {
      setLoading(true);
      setError(null);

      const provinceIdNum = parseInt(provinceId);
      const normalizeText = (text: string) =>
        text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const filteredTours = allTours.filter((tour) => {
        const matchProvince = provinceId === 'all' || tour.provinceIds.includes(provinceIdNum);
        const matchKeyword = normalizeText(tour.name).includes(normalizeText(keyword));
        return matchProvince && matchKeyword;
      });

      if (!allTours.length) {
        setError('Danh sách tour trống');
        setTours([]);
        setLoading(false);
        return;
      }

      setTours(filteredTours);
    } catch (error: any) {
      console.error('Error searching tours:', error);
      setError(error.message || 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTours(selectedProvinceId, searchQuery);
  }, [selectedProvinceId, searchQuery, isSearchResult]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    setIsSearchResult(true);
    searchTours(selectedProvinceId, searchQuery);
  };

  const handleProvinceClick = (provinceName: string) => {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const matchedProvince = province.find((prov) =>
      normalize(prov.name).includes(normalize(provinceName))
    );
    if (matchedProvince) {
      setSelectedProvinceId(matchedProvince.id);
      setSearchQuery('');
    } else {
      setError('Không tìm thấy tỉnh');
      setTours([]);
    }
  };

  const handleBack = () => {
    setIsSearchResult(false);
    setSearchQuery('');
    setSelectedProvinceId('all');
    setTours(allTours);
    setError(null);
  };

  const toggleFavorite = (id: string) => {
    setTours(
      tours.map((tour) =>
        tour.id === id ? { ...tour, isFavorite: !tour.isFavorite } : tour
      )
    );
  };

  const renderProvinceItem = ({ item }: { item: ProvinceType }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.image?.[0] || 'https://via.placeholder.com/60' }}
        style={styles.itemImage}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemname}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || 'Khám phá điểm đến tuyệt vời với những trải nghiệm độc đáo.'}
        </Text>
      </View>
    </View>
  );

  const renderTourItem = ({ item }: { item: TourItem }) => (
    <TouchableOpacity style={styles.ContainerItem}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.featuredImageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setTours(
              tours.map((tour) =>
                tour.id === item.id ? { ...tour, featuredImageUrl: '' } : tour
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
      <Text style={styles.price}>Từ {item.fromPrice.toLocaleString()}đ/Người</Text>
    </TouchableOpacity>
  );

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {!isSearchResult && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleTabPress('Tour')}>
              <Text style={[styles.tab, activeTab === 'Tour' ? styles.tabActive : null]}>Tour</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('Khách sạn')}>
              <Text style={[styles.tab, activeTab === 'Khách sạn' ? styles.tabActive : null]}>
                Khách sạn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('Vé tham quan')}>
              <Text style={[styles.tab, activeTab === 'Vé tham quan' ? styles.tabActive : null]}>
                Vé tham quan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('Đặt xe')}>
              <Text style={[styles.tab, activeTab === 'Đặt xe' ? styles.tabActive : null]}>Đặt xe</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={isSearchResult ? styles.searchResultContainer : styles.containerBorder}>
          <View style={styles.searchWrapper}>
            {isSearchResult && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <AntDesign name="arrowleft" size={24} color="#000" />
              </TouchableOpacity>
            )}
            <View style={styles.searchContainer}>
              <FontAwesome6 name="location-dot" size={20} color="#f97316" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Bạn muốn đi đâu ?"
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <AntDesign name="search1" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {isSearchResult && (
              <TouchableOpacity style={styles.filterButtonIcon}>
                <SlidersHorizontal  size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {!isSearchResult && (
            <>
              <Text style={styles.searchname}>Bạn sẽ đi đâu ?</Text>
              <Text style={styles.sectionname}>Tìm kiếm gần đây ?</Text>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => handleProvinceClick('Đà Lạt')}
                >
                  <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
                  <Text style={styles.filterText}>Đà Lạt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => handleProvinceClick('Đà Nẵng')}
                >
                  <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
                  <Text style={styles.filterText}>Đà Nẵng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => handleProvinceClick('Hội An')}
                >
                  <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
                  <Text style={styles.filterText}>Hội An</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionname}>Thịnh hành gần nhất</Text>
              {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : (
                <FlatList
                  data={province}
                  renderItem={renderProvinceItem}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                />
              )}
            </>
          )}

          {isSearchResult && (
            <>
              {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : tours.length > 0 ? (
                <>
                  <Text style={styles.resultSummary}>
                    Có {tours.length} kết quả tour {searchQuery}
                  </Text>
                  <FlatList
                    data={showAll ? tours : tours.slice(0, 4)}
                    renderItem={renderTourItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
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
                </>
              ) : (
                <Text style={styles.infoText}>Không tìm thấy tour phù hợp.</Text>
              )}
            </>
          )}
        </View>

        {!isSearchResult && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSearch}>
            <Text style={styles.submitButtonText}>TÌM KIẾM</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  containerBorder: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    height: 550,
  },
  searchResultContainer: {
    flex: 1,
    marginTop: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 15,
    marginTop: 50,
  },
  tab: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  tabActive: {
    fontSize: 13,
    color: '#ff6200',
    fontFamily: 'Inter-Black',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  searchname: {
    fontSize: 18,
    fontFamily: 'Inter-Black',
    color: '#000',
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 2,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 43,
    fontSize: 13,
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  searchButton: {
    backgroundColor: '#ff6200',
    borderRadius: 255,
    padding: 9,
  },
  filterButtonIcon: {
    marginLeft: 10,
    padding: 9,
  },
  sectionname: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginVertical: 10,
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'Inter-Medium',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: 'gray',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemname: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  itemDescription: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    backgroundColor: '#ff6200',
    borderRadius: 25,
    paddingVertical: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: 130,
    marginLeft: 180,
    height: 43,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  ContainerItem: {
    width: (Dimensions.get('window').width - 40) / 2,
    margin: 5,
    marginBottom: 15,
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
  listContainer: {
    paddingVertical: 5,
  },
  loadMoreButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  loadMoreText: {
    color: '#FF9500',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  resultSummary: {
    fontSize: 12,
    color: '#000',
    marginVertical: 10,
    fontFamily: 'Inter-Medium',
  },
});

export default SearchTour;