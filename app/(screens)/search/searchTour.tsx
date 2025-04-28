import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import tourApi from '@/services/tour';
import { ProvinceType, TourItem, TourListResponse } from '@/types/tour';

const SearchTour = () => {
  const [activeTab, setActiveTab] = useState('Tour');
  const [province, setProvince] = useState<ProvinceType[]>([]);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await tourApi.getProvince();
        console.log("Processed response:", response);
        setProvince(
          response.map((province: ProvinceType) => ({
            ...province,
            id: String(province.id),
          }))
        );
      } catch (error) {
        console.error('Error fetching provinces:', error);
        setError('Failed to fetch provinces');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Search tours by provinceId
  const searchToursByProvince = async (provinceId: string) => {
    try {
      setLoading(true);
      setError(null);
      const formData = {
        provinceIds: [parseInt(provinceId)], // Convert to number and pass as array
        fromPrice: 0,
        toPrice: 0,
        groupIds: [],
        durations: [],
        guestQuantitys: [],
        page: 1,
        pageSize: 20,
      };
      const response: TourListResponse = await tourApi.searchTour(formData);
      const fetchedTours: TourItem[] = response.data.datas.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        slug: item.slug,
        featuredImageUrl: item.featuredImageUrl,
        vote: item.vote || 0,
        fromPrice: item.fromPrice || 0,
        isFavorite: false,
      }));
      setTours(fetchedTours);
    } catch (error: any) {
      console.error('Error searching tours:', error);
      setError(error.message || 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const matchedProvince = province.find(
      (prov) => prov.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (matchedProvince) {
      searchToursByProvince(matchedProvince.id);
    } else {
      setError('No province found for the search query');
      setTours([]);
    }
  };

  // Handle clicking on a province (e.g., Đà Nẵng filter button)
  const handleProvinceClick = (provinceName: string) => {
    const matchedProvince = province.find(
      (prov) => prov.name.toLowerCase() === provinceName.toLowerCase()
    );
    if (matchedProvince) {
      searchToursByProvince(matchedProvince.id);
      setSearchQuery(provinceName); // Update search input to reflect clicked province
    }
  };

  // Render province item
  const renderProvinceItem = ({ item }: { item: ProvinceType }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image?.[0] || 'https://via.placeholder.com/60' }} style={styles.itemImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemname}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || 'Khám phá điểm đến tuyệt vời với những trải nghiệm độc đáo.'}
        </Text>
      </View>
    </View>
  );

  // Render tour item
  const renderTourItem = ({ item }: { item: TourItem }) => (
    <TouchableOpacity style={styles.tourItemContainer}>
      <Image
        source={{ uri: item.featuredImageUrl || 'https://via.placeholder.com/150' }}
        style={styles.tourImage}
      />
      <View style={styles.tourTextContainer}>
        <Text style={styles.tourName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.tourPrice}>Từ {item.fromPrice.toLocaleString()}đ/Người</Text>
      </View>
    </TouchableOpacity>
  );

  // Handle tab press
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header Tabs */}
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

        <View style={styles.containerBorder}>
          {/* Search Bar */}
          <Text style={styles.searchname}>Bạn sẽ đi đâu ?</Text>
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

          {/* Filters */}
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

          {/* Recent Searches or Search Results */}
          <Text style={styles.sectionname}>
            {tours.length > 0 ? 'Kết quả tìm kiếm' : 'Thịnh hành gần nhất'}
          </Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : tours.length > 0 ? (
            <FlatList
              data={tours}
              renderItem={renderTourItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          ) : (
            <FlatList
              data={province}
              renderItem={renderProvinceItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSearch}>
          <Text style={styles.submitButtonText}>TÌM KIẾM</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
    elevation: 2,
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
  tourItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  tourImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  tourTextContainer: {
    flex: 1,
  },
  tourName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  tourPrice: {
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
});

export default SearchTour;