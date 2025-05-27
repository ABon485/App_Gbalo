import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';


const TourDetailScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Tour Detail Section */}
        <Text style={styles.sectionHeader}>Chi tiết Tour</Text>
        
        <View style={styles.tourCard}>
          <Image 
            source={require('@/assets/images/BackGroud.png')} 
            style={styles.tourImage} 
          />
          <View style={styles.tourInfo}>
            <Text style={styles.tourTitle}>Tour sông đầm đệ đẹp BaNaHill/Cầu vàng</Text>
            <Text style={styles.tourDate}>Ngày khởi hành: 15/03/2025</Text>
            <View style={styles.priceSection}>
              <Text style={styles.priceRow}>Người lớn</Text>
              <Text style={styles.priceValue}>2 x 1.988.000vnd</Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.priceRow}>Em bé</Text>
              <Text style={styles.priceValue}>1 x 988.000vnd</Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.priceRow}>Mã đơn hàng</Text>
              <Text style={styles.priceValue}>#BNH20250315X</Text>
            </View>
            <Text style={styles.totalPrice}>Tổng tiền: 1.234.568 đ</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>Trạng thái: Đang chờ thanh toán</Text>
              <Text style={styles.countdown}>01:48:17</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên lạc</Text>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Họ và tên:</Text>
            <Text style={styles.contactValue}>Nguyễn Chí Thành</Text>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>thanhnguyen172309@gmail.com</Text>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Số điện thoại:</Text>
            <Text style={styles.contactValue}>0359998691</Text>
          </View>
        </View>

        {/* Inclusions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bao gồm</Text>
          <Text style={styles.bulletPoint}>• Xe đưa đón tận nơi tại Đà Nẵng</Text>
          <Text style={styles.bulletPoint}>• Vé vào cổng khu du lịch Bà Nà Hills</Text>
          <Text style={styles.bulletPoint}>• Vé cáp treo khứ hồi Bà Nà Hills</Text>
        </View>

        {/* Notes & Policies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý & Chính sách:</Text>
          <Text style={styles.bulletPoint}>• Mang theo CMND/CCCD hoặc hộ chiếu để xác nhận danh tính</Text>
          <Text style={styles.bulletPoint}>• Đến đúng giờ tại điểm hẹn để không bị lỡ lịch trình</Text>
          <Text style={styles.bulletPoint}>• Chính sách hủy tour: Hủy trước 3 ngày hoàn 50%</Text>
        </View>

        {/* Quick Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ nhanh</Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportText}>Trở chuyển về Gbalo</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop:50,

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft:10
  },
  scrollContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
tourCard: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  marginHorizontal: 16,
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc', 
},

  tourImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  tourInfo: {
    flex: 1,
  },
  tourTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
  },
  tourDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  priceRow: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 12,
    color: '#666',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
    marginTop: 4,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  countdown: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '600',
  },
  section: {
  backgroundColor: '#fff',
  marginHorizontal: 16,
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc', 
},

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  contactSection: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  contactValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportText: {
    fontSize: 14,
    color: '#007AFF',
    flex: 1,
  },
});

export default TourDetailScreen;