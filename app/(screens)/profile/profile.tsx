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
import * as ImagePicker from "expo-image-picker";
import { useToast } from "@/context/ToastContext";
import { ProfileResponse } from "@/types/user";
import UserNameModal from "@/components/profile/userName";
import EmailModal from "@/components/profile/Email";
import PhoneModal from "@/components/profile/phoneNumber";
import AddressModal from "@/components/profile/address";
import LinkedAccountModal from "@/components/profile/linkedAccount";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileUpdateScreen = () => {
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
      showToast({ message: "Không thể tải dữ liệu.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast({
        message: "Cần cấp quyền truy cập thư viện ảnh.",
        type: "error",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) throw new Error("Không tìm thấy dữ liệu người dùng");

      const parsedData = JSON.parse(data);
      const token = parsedData?.token;
      if (!token) throw new Error("Token không tồn tại");

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const response = await api.post("/Accounts/ChangeProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      const newAvatarUrl = response.data.data.avatar;
      setProfile((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
      showToast({
        message: "Cập nhật ảnh đại diện thành công",
        type: "success",
      });
    } catch (error) {
      if ((error as any).response?.status === 401) {
        showToast({
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
          type: "error",
        });
      } else if ((error as any).response?.status === 400) {
        showToast({
          message:
            (error as any).response?.data?.message || "Ảnh không hợp lệ.",
          type: "error",
        });
      } else {
        showToast({
          message: "Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEmailUpdated = (newEmail: string) => {
    if (profile) {
      setProfile({ ...profile, email: newEmail });
    }
  };

  const handlePhoneUpdated = (newPhone: string) => {
    if (profile) {
      setProfile({ ...profile, phone: newPhone });
    }
  };

  const handleNameUpdated = (newName: string) => {
    if (profile) {
      setProfile({ ...profile, fullName: newName });
    }
  };

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật thông tin cá nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              profile.avatar ||
              "https://files.vbalo.com/HgoApi?id=hgo_fm_testuploadfile&command=view&parameters=Rootimages.jpg",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.avatarOverlay} onPress={pickImage}>
          <MaterialCommunityIcons
            name="image-edit-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text style={styles.value}>
            {profile.fullName || "Chưa cung cấp"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowUserNameModal(true)}>
          <Text style={styles.editButton}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <UserNameModal
          visible={showUserNameModal}
          onClose={() => setShowUserNameModal(false)}
          title="Họ và tên"
          content={profile.fullName || ""}
          onUpdateName={handleNameUpdated}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Địa chỉ email:</Text>
          <Text style={styles.value}>{profile.email || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity
          disabled={!!profile.email} 
          onPress={() => setShowEmailModal(true)}
          style={profile.email ? { display: "none" } : {}} 
        >
          <Text style={[styles.editButton, profile.email && { color: "#999" }]}>
            {profile.phone ? "Không thể sửa" : "Thêm"}
          </Text>
        </TouchableOpacity>

        <EmailModal
          visible={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          title="Địa chỉ email"
          content={profile.email || ""}
          onUpdateEmail={handleEmailUpdated}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{profile.phone || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity
          disabled={!!profile.phone} 
          onPress={() => setShowPhoneModal(true)}
          style={profile.phone ? { display: "none" } : {}} 
        >
          <Text style={[styles.editButton, profile.phone && { color: "#999" }]}>
            {profile.email ? "Thêm": "Không thể sửa"}
          </Text>
        </TouchableOpacity>

        <PhoneModal
          visible={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          title="Số điện thoại"
          content={profile.phone || ""}
          onUpdatePhone={handlePhoneUpdated}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>{profile.address || "Chưa cung cấp"}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAddressModal(true)}>
          <Text style={styles.editButton}>Thêm</Text>
        </TouchableOpacity>
        <AddressModal
          visible={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title="Địa chỉ"
          content={profile.address || ""}
        />
      </View>

      {/* <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.label}>Liên kết tài khoản (Google, Facebook, Apple ID)</Text>
          <Text style={styles.value}>
            {profile.linkedAccounts || "Chưa cung cấp"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowLinkedModal(true)}>
          <Text style={styles.editButton}>Thêm</Text>
        </TouchableOpacity>
        <LinkedAccountModal
          visible={showLinkedModal}
          onClose={() => setShowLinkedModal(false)}
          title="Liên kết tài khoản"
          content={profile.linkedAccounts || ""}
        />
      </View> */}
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
    backgroundColor: "#fff",
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
