"use client";

import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
const TourPaid = () => {
      const router = useRouter();
    const tours = [
        {
            id: 1,
            image: require('@/assets/images/BackGroud.png'),
            title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
            date: '15/03/2025',
            price: 'Trạng thái: Đã thanh toán',
            total: 'Tổng số: 1.234.556 đ',
            balance: 'Hiển thị chi tiết',
        },
        {
            id: 2,
            image: require('@/assets/images/BackGroud.png'),
            title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
            date: '15/03/2025',
            price: 'Trạng thái: Đã thanh toán',
            total: 'Tổng số: 1.234.556 đ',
            balance: 'Hiển thị chi tiết',
        },
        {
            id: 3,
            image: require('@/assets/images/BackGroud.png'),
            title: 'Tour sông đầm đệ đẹp BaNaHill/Cầu vàng',
            date: '15/03/2025',
            price: 'Trạng thái: Đã thanh toán',
            total: 'Tổng số: 1.234.556 đ',
            balance: 'Hiển thị chi tiết',
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
                            <Text style={styles.tourBalance}onPress={() => router.push('/(screens)/tourOder/oderDetail')}>{tour.balance}</Text>
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
        marginTop: 4,
    },
    tourPrice: {
        fontSize: 14,
        marginTop: 4,
    },
    tourTotal: {
        fontSize: 14,
        marginTop: 4,
    },
    tourBalance: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
        textDecorationLine: 'underline',
    },
});

export default TourPaid;