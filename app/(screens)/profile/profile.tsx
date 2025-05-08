import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileResponse } from "@/types/user";
import UserNameModal from "@/components/profile/userName";
import EmailModal from "@/components/profile/Email";
import PhoneModal from "@/components/profile/phoneNumber";
import AddressModal from "@/components/profile/address";
import LinkedAccountModal from "@/components/profile/linkedAccount";

const ProfileUpdateScreen = () => {
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUserNameModal, setShowUserNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLinkedModal, setShowLinkedModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) throw new Error("Không tìm thấy dữ liệu người dùng");

      const parsedData = JSON.parse(data);
      const token = parsedData?.token;
      if (!token) throw new Error("Token không tồn tại");

      const response = await api.get("/Accounts/Profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không thể tải dữ liệu.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật thông tin cá nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profile.avatar || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.avatarOverlay}>
          <Icon name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Họ và tên */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text style={styles.value}>{profile.fullName || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowUserNameModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <UserNameModal
          visible={showUserNameModal}
          onClose={() => setShowUserNameModal(false)}
          title="Họ và tên của bạn"
          content={profile.fullName || ""}
        />
      </View>

      {/* Email */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Địa chỉ email:</Text>
          <Text style={styles.value}>{profile.email || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowEmailModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <EmailModal
          visible={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          title="Địa chỉ email"
          content={profile.email || ""}
        />
      </View>

      {/* Phone */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{profile.phone || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPhoneModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <PhoneModal
          visible={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          title="Số điện thoại"
          content={profile.phone || ""}
        />
      </View>

      {/* Địa chỉ */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>{profile.address || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAddressModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <AddressModal
          visible={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title="Địa chỉ"
          content={profile.address || ""}
        />
      </View>

      {/* Liên kết tài khoản */}
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Liên kết tài khoản:</Text>
          <Text style={styles.value}>{profile.linkedAccounts || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowLinkedModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <LinkedAccountModal
          visible={showLinkedModal}
          onClose={() => setShowLinkedModal(false)}
          title="Liên kết tài khoản"
          content={profile.linkedAccounts || ""}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "900",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: "30%",
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  rowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontWeight: "900",
    fontFamily: "Inter",
  },
  value: {
    fontFamily: "Inter",
    color: "#333",
    marginTop: 2,
  },
  editButton: {
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileUpdateScreen;
