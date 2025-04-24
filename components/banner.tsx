import React, { useEffect, useRef, useState } from 'react';
import { View, Image, FlatList, Text, StyleSheet, Dimensions } from 'react-native';

// Định nghĩa kiểu cho ảnh banner
type BannerImage = {
  uri: string;
};

// Danh sách ảnh banner
const bannerImages: BannerImage[] = [
  require('@/assets/images/home/Caurong.png'),
  require('@/assets/images/home/cauvang.png'),
  require('@/assets/images/home/hoian.png'),
  require('@/assets/images/home/hoian1.png'),
  require('@/assets/images/home/tinhyeu.png'),
  require('@/assets/images/home/linhung.png'),
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
        <Image source={item} style={styles.bannerImage} />
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
    width: width, // Chiều rộng toàn màn hình để phân trang
    alignItems: 'center', // Căn giữa bannerContainer
  },
  bannerContainer: {
    marginTop: 8,
    width: 340, // Chiều rộng bằng với bannerImage
    height: 160, // Chiều cao bằng với bannerImage
    backgroundColor: 'transparent', // Trong suốt
  },
  bannerImage: {
    width: 340,
    height: 160,
    borderRadius: 10,
  },
});

export default Banner;