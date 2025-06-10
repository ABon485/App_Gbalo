import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ResetPasswordScreen from '@/components/profile/resetLoginScurity';
import { router } from 'expo-router';

export default function Security() {
  const [isResetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);

  const handleUpdatePasswordPress = () => {
    setResetPasswordModalVisible(true);
  };

  const handleCloseModal = () => {
    setResetPasswordModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng nhập với bảo mật</Text>
      </View>

      {/* Shield Icon Section */}
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/images/home/security.png")}
          style={styles.icon}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Đổi mật khẩu</Text>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePasswordPress}>
            <Text style={styles.updateText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Cập nhật lần đầu tiên trong 1 tháng trước"
          placeholderTextColor="#888"
          editable={false}
        />
      </View>

      {/* History Input */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Lịch sử đăng nhập</Text>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Xem nhật ký hoạt động đăng nhập của tài khoản của bạn"
          placeholderTextColor="#888"
          editable={false}
        />
      </View>

      {/* 2FA Input */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Bảo mật 2 lớp (2FA)</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>Thêm</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Chưa dữ liệu cập nhật"
          placeholderTextColor="#888"
          editable={false}
        />
      </View>

      {/* Question Input */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Bạn đã từng có tài khoản nào chưa?</Text>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Gmail, Facebook, Apple ID"
          placeholderTextColor="#888"
          editable={false}
        />
      </View>

      {/* Reset Password Modal */}
      {isResetPasswordModalVisible && (
        <ResetPasswordScreen
          visible={isResetPasswordModalVisible}
          onClose={handleCloseModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,

  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  updateButton: {
    padding: 5,
  },
  updateText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  detailButton: {
    padding: 5,
  },
  detailText: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  addButton: {
    padding: 5,
  },
  addText: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});