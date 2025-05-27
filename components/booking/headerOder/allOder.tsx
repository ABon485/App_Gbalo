import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const TourListScreen = () => {
  const router = useRouter();

  const tours = [
    {
      id: 1,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: '2 x 1.988.000VND',
      total: 'Tổng số: 1.234.556 đ',
      status: 'Trạng thái: Đã thanh toán',
      balance: 'Hiển thị chi tiết',
    },
    {
      id: 2,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: '1 x 988.000VND',
      total: 'Tổng số: 1.234.556 đ',
      status: 'Trạng thái: Đang chờ thanh toán 01:48:17',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Thanh toán',
    },
    {
      id: 3,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: '2 x 1.988.000VND',
      total: 'Tổng số: 5.434.556 đ',
      status: 'Trạng thái: Đã thanh toán',
      balance: 'Hiển thị chi tiết',
      cancelText: 'Xem đơn hàng',
    },
    {
      id: 4,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: '1 x 988.000VND',
      total: 'Tổng số: 1.234.556 đ',
      status: 'Trạng thái: Đã thanh toán',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Đặt lại',
    },
    {
      id: 5,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: '1 x 988.000VND',
      total: 'Tổng số: 1.234.556 đ',
      status: 'Trạng thái: Đang chờ thanh toán 01:48:17',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Thanh toán',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {tours.map((tour) => (
        <View key={tour.id} style={styles.tourItem}>
          <Image source={tour.image} style={styles.tourImage} />
          <View style={styles.tourDetails}>
            <Text style={styles.tourTitle}>{tour.title}</Text>
            <Text style={styles.tourDate}>{tour.date}</Text>
            <Text style={styles.tourPrice}>{tour.price}</Text>
            <Text style={styles.tourStatus}>{tour.status}</Text>
            <Text style={styles.tourTotal}>{tour.total}</Text>
            <TouchableOpacity onPress={() => router.push('/(screens)/tourOder/oderDetail')}>
              <Text style={styles.tourBalance}>{tour.balance}</Text>
            </TouchableOpacity>
            {tour.buttonText && (
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{tour.buttonText}</Text>
              </TouchableOpacity>
            )}
            {tour.cancelText && (
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{tour.cancelText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  tourItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
  },
  tourImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  tourDetails: {
    flex: 1,
    padding: 10,
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tourDate: {
    fontSize: 14,
    color: '#666',
  },
  tourPrice: {
    fontSize: 14,
    color: '#666',
  },
  tourStatus: {
    fontSize: 14,
    color: '#ff4500',
  },
  tourTotal: {
    fontSize: 14,
    color: '#666',
  },
  tourBalance: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ff4500',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default TourListScreen;