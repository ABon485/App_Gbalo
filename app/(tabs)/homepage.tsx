import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Suggested from '@/components/home/Suggested';
import Recent from '@/components/home/Recent';
import Popular from '@/components/home/Popular';
import SearchHeader from '@/components/home/search';
import DestinationSection from '@/components/home/attractive';
import Banner from '@/components/banner';

// Import hình ảnh từ thư mục assets
const bannerImage = require('@/assets/images/home/Caurong.png');

const Home = () => {
  const [activeTab, setActiveTab] = useState('suggested');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SearchHeader />
        <Banner/>
        {/* Banner */}
        {/* <View style={styles.bannerContainer}>
          <Image source={bannerImage} style={styles.bannerImage} />
          <Text style={styles.bannerText}>
            
          </Text>
        </View> */}
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
        <DestinationSection />
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