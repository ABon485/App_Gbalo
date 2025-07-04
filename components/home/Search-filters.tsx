import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import tourApi from '@/services/tour';
import { TourGroupType, ProvinceType, TourListResponse, searchTourType } from '@/types/tour';

interface SearchFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (tours: TourListResponse) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ visible, onClose, onApply }) => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(8000000);
  const [selectedTourTypes, setSelectedTourTypes] = useState<number[]>([1]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [tourTypes, setTourTypes] = useState<TourGroupType[]>([]);
  const [destinations, setDestinations] = useState<ProvinceType[]>([]);
  // Thay destinationPlaces bằng locationPlaces với dữ liệu tĩnh
  const [locationPlaces, setLocationPlaces] = useState<{ id: string; name: string; type: string }[]>([
    { id: '1', name: 'Vịnh Hạ Long', type: 'loc' },
    { id: '2', name: 'Phong Nha', type: 'loc' },
    { id: '3', name: 'Đà Lạt', type: 'loc' },
    { id: '4', name: 'Hội An', type: 'loc' },
    { id: '5', name: 'Phú Quốc', type: 'loc' },
  ]);
  const [showAllDestinations, setShowAllDestinations] = useState<boolean>(false);
  const [showAllPlaces, setShowAllPlaces] = useState<boolean>(false);
  const [showAllTourTypes, setShowAllTourTypes] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tourGroups, provinces] = await Promise.all([
          tourApi.getTourGroups(),
          tourApi.getProvince(),
        ]);
        setTourTypes(tourGroups);
        setDestinations(provinces);
        // Không gọi getProvinceDestination, sử dụng locationPlaces tĩnh
      } catch (err) {
        setError('Không thể tải dữ liệu bộ lọc');
        console.error('Error fetching filter data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelection = <T extends string | number>(
    id: T,
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

  const handleApply = async () => {
    try {
      // Get names of selected places for searchText
      const selectedPlaceNames = locationPlaces
        .filter(place => selectedPlaces.includes(place.id))
        .map(place => place.name)
        .join(", ");

      // Construct formData for API call
      const formData: searchTourType = {
        fromPrice: minPrice,
        toPrice: maxPrice,
        provinceIds: selectedDestinations.map(id => Number(id)),
        groupIds: selectedTourTypes,
        durations: [],
        guestQuantitys: [],
        searchText: selectedPlaceNames,
        page: 1,
        pageSize: 20,
      };

      // Call API and handle response
      console.log("Gửi searchTour với formData:", formData);
      const tours = await tourApi.searchTour(formData);
      console.log("Phản hồi từ API:", tours);
      onApply(tours);
      onClose(); // Close modal after applying
    } catch (error) {
      console.error("Lỗi khi áp dụng bộ lọc:", error);
      // Consider adding error handling, e.g., showing a message to the user
    }
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(20000000);
    setSelectedTourTypes([]);
    setSelectedDestinations([]);
    setSelectedPlaces([]);
    setShowAllDestinations(false);
    setShowAllTourTypes(false);
    setShowAllPlaces(false);
  };

  const formatPrice = (value: number): string => {
    return value >= 1000000
      ? `${Math.floor(value / 1000000)} Triệu`
      : `${value.toLocaleString()}đ`;
  };

  if (loading) {
    return (
      <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Đang tải...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>{error}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.applyText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Bộ lọc</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.redBar} />
                <Text style={styles.sectionTitle}>Khoảng giá trị</Text>
              </View>
              <Text style={styles.priceValue}>
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>0đ</Text>
                <MultiSlider
                  values={[minPrice, maxPrice]}
                  onValuesChange={([min, max]) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  min={0}
                  max={20000000}
                  step={100000}
                  allowOverlap={false}
                  snapped
                  sliderLength={220}
                  trackStyle={{
                    backgroundColor: '#E0E0E0',
                    height: 2,
                  }}
                  selectedStyle={{
                    backgroundColor: '#FF6200',
                  }}
                  markerStyle={{
                    backgroundColor: '#FF6200',
                    height: 15,
                    width: 15,
                    borderRadius: 10,
                  }}
                />
                <Text style={styles.sliderLabel}>20.000.000đ</Text>
              </View>
            </View>

            {/* Tour Types */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.redBar} />
                <Text style={styles.sectionTitle}>Loại Tour</Text>
              </View>
              {(showAllTourTypes ? tourTypes : tourTypes.slice(0, 4)).map(type => (
                <View key={type.id} style={styles.checkboxRow}>
                  <Text style={styles.checkboxLabel}>{type.name}</Text>
                  <TouchableOpacity
                    style={styles.checkboxTouchable}
                    onPress={() => toggleSelection<number>(type.id, selectedTourTypes, setSelectedTourTypes)}
                  >
                    <View style={[styles.checkbox, selectedTourTypes.includes(type.id) && styles.checked]}>
                      {selectedTourTypes.includes(type.id) && <AntDesign name="check" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              {tourTypes.length > 4 && (
                <TouchableOpacity onPress={() => setShowAllTourTypes(!showAllTourTypes)}>
                  <Text style={styles.showMore}>
                    {showAllTourTypes ? 'Ẩn bớt' : 'Hiển thị thêm'} <AntDesign name={showAllTourTypes ? 'up' : 'down'} size={12} color="#888" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Destinations */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.redBar} />
                <Text style={styles.sectionTitle}>Địa điểm</Text>
              </View>
              {(showAllDestinations ? destinations : destinations.slice(0, 4)).map(city => (
                <View key={city.id} style={styles.checkboxRow}>
                  <Text style={styles.checkboxLabel}>{city.name}</Text>
                  <TouchableOpacity
                    style={styles.checkboxTouchable}
                    onPress={() => toggleSelection<string>(city.id, selectedDestinations, setSelectedDestinations)}
                  >
                    <View style={[styles.checkbox, selectedDestinations.includes(city.id) && styles.checked]}>
                      {selectedDestinations.includes(city.id) && <AntDesign name="check" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              {destinations.length > 4 && (
                <TouchableOpacity onPress={() => setShowAllDestinations(!showAllDestinations)}>
                  <Text style={styles.showMore}>
                    {showAllDestinations ? 'Ẩn bớt' : 'Hiển thị thêm'} <AntDesign name={showAllDestinations ? 'up' : 'down'} size={12} color="#888" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Places */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.redBar} />
                <Text style={styles.sectionTitle}>Điểm đến</Text>
              </View>
              {(showAllPlaces ? locationPlaces : locationPlaces.slice(0, 4)).map(place => (
                <View key={place.id} style={styles.checkboxRow}>
                  <Text style={styles.checkboxLabel}>{place.name}</Text>
                  <TouchableOpacity
                    style={styles.checkboxTouchable}
                    onPress={() => toggleSelection<string>(place.id, selectedPlaces, setSelectedPlaces)}
                  >
                    <View style={[styles.checkbox, selectedPlaces.includes(place.id) && styles.checked]}>
                      {selectedPlaces.includes(place.id) && <AntDesign name="check" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              {locationPlaces.length > 4 && (
                <TouchableOpacity onPress={() => setShowAllPlaces(!showAllPlaces)}>
                  <Text style={styles.showMore}>
                    {showAllPlaces ? 'Ẩn bớt' : 'Hiển thị thêm'} <AntDesign name={showAllPlaces ? 'up' : 'down'} size={12} color="#888" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Xóa tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles (giữ nguyên, chỉ thêm một số điều chỉnh nhỏ cho MultiSlider)
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  redBar: {
    width: 5,
    height: 16,
    backgroundColor: '#FF6200',
    marginRight: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between', // Căn đều các phần tử
  },
  sliderLabel: {
    fontSize: 12,
    color: '#888',
  },
  priceValue: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 4,
  },
  checkboxTouchable: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#FF6200',
    borderColor: '#FF6200',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
  },
  showMore: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#888',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF6200',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  resetText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  spacer: {
    height: 20,
  },
});

export default SearchFilters;