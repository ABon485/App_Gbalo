import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import  {BookingItem}  from '@/types/tour'; // Adjust the import path
import bookingApi from "@/services/tour";

const TourComplete = () => {
  const router = useRouter();
  const [tours, setTours] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await bookingApi.getBooking();
        // Filter for bookings that are completed or refunded (assuming status 3 for completed, 4 for refunded)
        const completedTours = response.data.datas.filter(
          (item: BookingItem) => item.bookingStatus === 3 || item.bookingStatus === 4
        );
        setTours(completedTours);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch completed/refunded bookings:', error);
        setLoading(false);
      }
    };

    fetchCompletedBookings();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  const getStatusText = (item: BookingItem) => {
    if (item.bookingStatus === 4) {
      return 'Trạng thái: Đã hoàn tiền';
    }
    return 'Trạng thái: Hoàn thành';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (tours.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Chưa có tour được đặt</Text>
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
              <Text style={styles.tourTotal}>Tổng số: {formatCurrency(tour.totalAmount)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button1}>
                  <Text style={styles.buttonText1}>Đặt lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2} onPress={() => router.push('/')}>
                  <Text style={styles.buttonText2}>Viết đánh giá</Text>
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
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  tourItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    justifyContent: 'space-between',
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tourDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tourPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tourTotal: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button1: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff4500',
  },
  button2: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText1: {
    color: '#ff4500',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonText2: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TourComplete;