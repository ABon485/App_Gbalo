import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BookingItem } from '@/types/tour';
import bookingApi from "@/services/tour";

const TourPending = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const response = await bookingApi.getBooking();
        const pendingTours = response.data.datas.filter((item: BookingItem) => item.amountRemaining > 0);
        setTours(pendingTours);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pending bookings:', error);
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  const getStatusText = (item: BookingItem) => {
    const timeRemaining = new Date(item.pendingPaymentCreated).toLocaleTimeString('vi-VN');
    return `Trạng thái: Đang chờ thanh toán ${timeRemaining}`;
  };



  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {tours.map((tour) => (
          <View key={tour.id} style={styles.tourItem}>
            <Image
              source={tour.serviceImageUrl ? { uri: tour.serviceImageUrl } : require('@/assets/images/BackGroud.png')}
              style={styles.tourImage}
            />
            <View style={styles.tourDetails}>
              <Text style={styles.tourTitle}>{tour.serviceName}</Text>
              <Text style={styles.tourDate}>{new Date(tour.departureDate).toLocaleDateString('vi-VN')}</Text>
              <Text style={styles.tourPrice}>{getStatusText(tour)}</Text>
              <Text style={styles.tourTotal}>
                Tổng số: <Text style={styles.orangeText}>{formatCurrency(tour.totalAmount)}</Text>
              </Text>
              <View style={styles.bottomRow}>
                <TouchableOpacity onPress={() => router.push('/(screens)/tourOder/oderDetail')}>
                  <Text style={styles.tourBalance}>Hiển thị chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  tourItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  tourImage: {
    width: 100,
    height: 110,
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 5
  },
  tourDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tourDate: {
    fontSize: 14,
    marginTop: 4,
  },
  tourPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  tourTotal: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  orangeText: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  tourBalance: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: 'gray',
  },
  button: {
    backgroundColor: '#ff4500',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default TourPending;