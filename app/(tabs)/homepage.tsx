import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Suggested from '@/components/home/Suggested';
import Recent from '@/components/home/Recent';
import Popular from '@/components/home/Popular';
import SearchHeader from '@/components/home/search';

// Import hình ảnh từ thư mục assets
const bannerImage = require('@/assets/images/home/Caurong.png');

const Home = () => {
  const [activeTab, setActiveTab] = useState('suggested');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SearchHeader />
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={bannerImage} style={styles.bannerImage} />
          <Text style={styles.bannerText}>
            
          </Text>
        </View>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('suggested')}>
            <Text style={activeTab === 'suggested' ? styles.activeTabText : styles.inactiveTabText}>
              Đề xuất
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('recent')}>
            <Text style={activeTab === 'recent' ? styles.activeTabText : styles.inactiveTabText}>
              Gần đây
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('popular')}>
            <Text style={activeTab === 'popular' ? styles.activeTabText : styles.inactiveTabText}>
              Trending
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị component tương ứng với tab */}
        {activeTab === 'suggested' && <Suggested />}
        {activeTab === 'recent' && <Recent />}
        {activeTab === 'popular' && <Popular />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor:'white' 
  },
  bannerContainer: {
    marginTop: 8, 
    alignItems:'center',
    
  },
  bannerImage: {
    width: 340,
    height: 160, 
    borderRadius:10
  },
  bannerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    color: 'white',
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16, // px-4
    paddingVertical: 24, // py-6
    gap: 16, // gap-4
  },
  activeTabText: {
    fontSize: 15, // text-lg
    color: '#f97316', // text-orange-500
    fontFamily:'Inter-Medium'
  },
  inactiveTabText: {
    fontSize: 15, // text-lg
    fontFamily:'Inter-Medium'
  },
});

export default Home;