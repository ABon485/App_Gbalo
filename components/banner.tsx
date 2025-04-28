import React, { useEffect, useRef, useState } from 'react';
import { View, Image, FlatList, Text, StyleSheet, Dimensions } from 'react-native';

// Định nghĩa kiểu cho ảnh banner
type BannerImage = {
  uri: number; // Change to number since require() returns a resource ID
  label: string;
};

// Danh sách ảnh banner và văn bản tương ứng
const bannerImages: BannerImage[] = [
  { uri: require('@/assets/images/home/Caurong.png'), label: 'Cầu Rồng' },
  { uri: require('@/assets/images/home/cauvang.png'), label: 'Cầu Vàng' },
  { uri: require('@/assets/images/home/hoian.png'), label: 'Hội An' },
  { uri: require('@/assets/images/home/hoian1.png'), label: 'Hội An 1' },
  { uri: require('@/assets/images/home/tinhyeu.png'), label: 'Tình Yêu' },
  { uri: require('@/assets/images/home/linhung.png'), label: 'Linh Ứng' },
];

const { width } = Dimensions.get('window');

const Banner = () => {
  const flatListRef = useRef<FlatList<BannerImage>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động cuộn mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= bannerImages.length ? 0 : prevIndex + 1;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Render từng item trong banner
  const renderItem = ({ item }: { item: BannerImage }) => (
    <View style={styles.itemContainer}>
      <View style={styles.bannerContainer}>
        <Image source={item.uri} style={styles.bannerImage} />
        {/* Thêm Text overlay */}
        <View style={styles.textOverlay}>
          <Text style={styles.bannerText}>{item.label}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={bannerImages}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    alignItems: 'center',
  },
  bannerContainer: {
    marginTop: 8,
    width: 340,
    height: 160,
    backgroundColor: 'transparent',
  },
  bannerImage: {
    width: 340,
    height: 160,
    borderRadius: 10,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 90, // Fix the bottom value (990 seems incorrect)
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontFamily:'Inter-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default Banner;