import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import tourApi from '@/services/tour';
import { ProvinceType } from '@/types/tour';

const SearchTour = () => {
  const [activeTab, setActiveTab] = useState('Tour');
  const [province, setProvince] = useState<ProvinceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvinceId, setSelectedProvinceId] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const responseProvinces = await tourApi.getProvince();
        setProvince(
          responseProvinces.map((province: ProvinceType) => ({
            ...province,
            id: String(province.id),
          }))
        );
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error);
        setError('Không tải được danh sách tỉnh');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceClick = (provinceName: string) => {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const matchedProvince = province.find((prov) =>
      normalize(prov.name).includes(normalize(provinceName))
    );
    if (matchedProvince) {
      setSelectedProvinceId(matchedProvince.id);
      router.push({
        pathname: '/(screens)/search/searchResult',
        params: { searchQuery: '', selectedProvinceId: matchedProvince.id },
      });
    } else {
      setError('Không tìm thấy tỉnh');
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSearchInputPress = () => {
    router.push({
      pathname: '/(screens)/search/searchResult',
      params: { searchQuery: '', selectedProvinceId },
    });
  };

  const renderProvinceItem = ({ item }: { item: ProvinceType }) => (
  <View style={styles.itemContainer}>
    <Image
      source={{ uri: item.image }}
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
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
          <View style={styles.searchWrapper}>
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={handleSearchInputPress}
              activeOpacity={0.8}
            >
              <FontAwesome6 name="location-dot" size={20} color="#f97316" style={styles.searchIcon} />
              <Text style={styles.fakeInput}>Bạn muốn đi đâu ?</Text>
              <View style={styles.searchButton}>
                <AntDesign name="search1" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>

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
            <Text style={styles.loadingText}>Đang tải...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={province}
              renderItem={renderProvinceItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          )}
        </View>
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
    height: 630,
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
    height:43,
  },
  searchIcon: {
    marginRight: 10,
  },
  fakeInput: {
    flex: 1,
    height: 20,
    fontSize: 13,
    color: '#888',
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
  loadingText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default SearchTour;