import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const SearchTour = () => {
  // State để theo dõi tab đang được chọn
  const [activeTab, setActiveTab] = useState('Tour');

  const recentSearches = [
    { id: '1', title: 'Đà Lạt', description: 'Đà Lạt là thành phố ngàn hoa nổi tiếng với khí hậu mát mẻ, cảnh quan thiên nhiên thơ mộng, hồ Xuân Hương.' },
    { id: '2', title: 'Đà Nẵng', description: 'Đà Nẵng là thành phố du lịch nổi tiếng với bãi biển đẹp, cầu Rồng, Bà Nà Hills và nhiều điểm tham quan hấp dẫn.' },
    { id: '3', title: 'Phú Quốc', description: 'Phú Quốc là thiên đường biển đảo nổi tiếng với bãi biển đẹp, nước trong xanh, và các hoạt động lặn ngắm san hô.' },
    { id: '4', title: 'Huế', description: 'Huế là thành phố cổ kính với nét đẹp văn hóa, lịch sử, Kinh thành Huế, sông Hương và các lăng tẩm.' },
    { id: '5', title: 'Kon Tum', description: 'Măng Đen là Kon Tum của thiên nhiên hoang sơ với rừng nguyên sinh, khí hậu mát mẻ và văn hóa dân tộc.' },
    { id: '6', title: 'Hội An', description: 'Hội An là phố cổ nổi tiếng với đèn lồng, kiến trúc cổ kính, và không gian văn hóa đậm đà bản sắc.' },
  ];

  const renderItem = ({ item }: { item: { id: string; title: string; description: string } }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.itemImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </View>
  );

  // Hàm xử lý khi nhấn vào tab
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
            <Text style={[styles.tab, activeTab === 'Khách sạn' ? styles.tabActive : null]}>Khách sạn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress('Vé tham quan')}>
            <Text style={[styles.tab, activeTab === 'Vé tham quan' ? styles.tabActive : null]}>Vé tham quan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress('Đặt xe')}>
            <Text style={[styles.tab, activeTab === 'Đặt xe' ? styles.tabActive : null]}>Đặt xe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerBorder}>
          {/* Search Bar */}
          <Text style={styles.searchTitle}>Bạn sẽ đi đâu ?</Text>
          <View style={styles.searchContainer}>
            <FontAwesome6 name="location-dot" size={20} color="#f97316" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Bạn muốn đi đâu ?"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.searchButton}>
              <AntDesign name="search1" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <Text style={styles.sectionTitle}>Tìm kiếm gần đây ?</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
              <Text style={styles.filterText}>Đà lạt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
              <Text style={styles.filterText}>Đà nẵng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <AntDesign name="enviromento" size={13} color="#888" style={styles.filterIcon} />
              <Text style={styles.filterText}>Hội an</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          <Text style={styles.sectionTitle}>Thịnh hành gần nhất</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.submitButton}>
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
    height:550

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
  searchTitle: {
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
  sectionTitle: {
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
  itemTitle: {
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
});

export default SearchTour;