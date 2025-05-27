"use client";

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for the back arrow
import AllOder from '@/components/booking/headerOder/allOder';
import Pending from '@/components/booking/headerOder/pending-payment';
import Paid from '@/components/booking/headerOder/paid';
import Complete from '@/components/booking/headerOder/Complete-payment';

const TourListScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Tất cả');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Update active tab
  };

  const handleBackPress = () => {
    router.push('/(tabs)/profile'); // Navigate back to the profile screen
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabPress('Tất cả')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'Tất cả' && styles.activeTabText]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Chờ thanh toán')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'Chờ thanh toán' && styles.activeTabText]}>
            Chờ thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Đã thanh toán')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'Đã thanh toán' && styles.activeTabText]}>
            Đã thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Hoàn tiền')} style={styles.tab}>
          <Text style={[styles.tabText, activeTab === 'Hoàn tiền' && styles.activeTabText]}>
            Hoàn tiền
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'Tất cả' && <AllOder />}
      {activeTab === 'Chờ thanh toán' && <Pending />}
      {activeTab === 'Đã thanh toán' && <Paid />}
      {activeTab === 'Hoàn tiền' && <Complete />}
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
    marginTop: 15,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
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
    textDecorationLine: 'underline',
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