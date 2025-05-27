"use client";

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const TourListScreen = () => {

  const tours = [
    {
      id: 1,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: 'Trạng thái: Đã thanh toán',
      total: 'Tổng số: 1.234.556 đ',
      balance: 'Hiển thị chi tiết',
    },
    {
      id: 2,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: 'Trạng thái: Đang chờ thanh toán 01:48:17',
      total: 'Tổng số: 1.234.556 đ',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Thanh toán',
    },
    {
      id: 3,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: 'Trạng thái: Đã thanh toán',
      total: 'Tổng số: 5.434.556 đ',
      balance: 'Hiển thị chi tiết',
      cancelText: 'Xem đơn hàng',
    },
    {
      id: 4,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: 'Ngày khởi hành: 15/03/2025',
      price: 'Trạng thái: Đã thanh toán',
      total: 'Tổng số: 1.234.556 đ',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Đặt lại',
    },
    {
      id: 5,
      image: require('@/assets/images/BackGroud.png'),
      title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
      date: '15/03/2025',
      price: 'Trạng thái: Đang chờ thanh toán 01:48:17',
      total: 'Tổng số: 1.234.556 đ',
      balance: 'Hiển thị chi tiết',
      buttonText: 'Thanh toán',
    },
  ];

  return (
    <View style={styles.container}>

      {/* Conditional Rendering Based on Active Tab */}
        <ScrollView style={styles.listContainer}>
          {tours.map((tour) => (
            <View key={tour.id} style={styles.tourItem}>
              <Image source={tour.image} style={styles.tourImage} />
              <View style={styles.tourDetails}>
                <Text style={styles.tourTitle}>{tour.title}</Text>
                <Text style={styles.tourDate}>{tour.date}</Text>
                <Text style={styles.tourPrice}>{tour.price}</Text>
                <Text style={styles.tourTotal}>{tour.total}</Text>
                <Text style={styles.tourBalance}>{tour.balance}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#ff4500',
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