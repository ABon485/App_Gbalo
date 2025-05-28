"use client";

import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const TourComplete = () => {
  const tours = [
    {
      id: 1,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: 'Trạng thái: Hoàn thành',
      total: 'Tổng số: 5.434.556 đ',
      balance: '',
      buttonText1: 'Đặt lại',
      buttonText2: 'Viết đánh giá',
    },
    {
      id: 2,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: 'Trạng thái: Hoàn thành',
      total: 'Tổng số: 5.434.556 đ',
      balance: '',
      buttonText1: 'Đặt lại ',
      buttonText2: 'Viết đánh giá',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {tours.map((tour) => (
          <View key={tour.id} style={styles.tourItem}>
            <Image source={tour.image} style={styles.tourImage} />
            <View style={styles.tourDetails}>
              <Text style={styles.tourTitle}>{tour.title}</Text>
              <Text style={styles.tourDate}>{tour.date}</Text>
              <Text style={styles.tourPrice}>{tour.price}</Text>
              <Text style={styles.tourTotal}>{tour.total}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button1}>
                  <Text style={styles.buttonText1}>{tour.buttonText1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2}>
                  <Text style={styles.buttonText2}>{tour.buttonText2}</Text>
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
  },
  listContainer: {
    flex: 1,
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
  backgroundColor: 'transparent', // hoặc có thể xóa dòng này luôn
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
});

export default TourComplete;