import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import api from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";
import { ProfileResponse } from "@/types/user";
import UserNameModal from "@/components/profile/userName";
import EmailModal from "@/components/profile/Email";
import PhoneModal from "@/components/profile/phoneNumber";
import AddressModal from "@/components/profile/address";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FileUploadWebView from "@/components/WebView_Upload";
import { Modal } from "react-native";

const ProfileUpdateScreen = () => {
  const params = useLocalSearchParams();
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [showUserNameModal, setShowUserNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const fetchProfile = async () => {
    try {
      // Ưu tiên lấy từ query params nếu có
      if (params.id) {
        setProfile({
          id: params.id as string,
          fullName: params.fullName as string,
          email: params.email as string,
          phone: params.phone as string,
          avatar: params.avatar as string,
          address: params.address as string,
          userName: params.userName as string,
          createDate: params.createDate as string,
          roles: [],
          permissions: [],
          language: params.language as string,
          nationality: params.nationality as string,
          dateOfBirth: params.dateOfBirth
            ? new Date(params.dateOfBirth as string)
            : new Date(),
        });
        setLoading(false);
        return;
      }

      // Nếu không có params, lấy từ AsyncStorage
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        setProfile({
          id: parsedData.id || "",
          fullName: parsedData.fullName || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
          avatar: parsedData.avatar || "",
          address: parsedData.address || "",
          userName: parsedData.userName || "",
          createDate: parsedData.createDate || "",
          roles: parsedData.roles || [],
          permissions: parsedData.permissions || [],
          language: parsedData.language || "",
          nationality: parsedData.nationality || "",
          dateOfBirth: parsedData.dateOfBirth
            ? new Date(parsedData.dateOfBirth)
            : new Date(),
        });
        setLoading(false);
        return;
      }

      // Nếu không có trong AsyncStorage, gọi API (nếu muốn)
      const dataFromStorage = await AsyncStorage.getItem("data");
      const parsedData = dataFromStorage ? JSON.parse(dataFromStorage) : null;
      const token = parsedData?.token;
      if (!token) throw new Error("Token không tồn tại");
      const response = await api.get("/Accounts/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.data);

      throw new Error("Không tìm thấy dữ liệu người dùng");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin:", error);
      showToast({ message: "Không thể tải dữ liệu.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateAvatarUrl = async (fileUrl: string) => {
    console.log("Avatar URL nhận được:", fileUrl);
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) throw new Error("Không tìm thấy dữ liệu người dùng");

      const parsedData = JSON.parse(data);
      const token = parsedData?.token;
      if (!token) throw new Error("Token không tồn tại");

      const response = await api.post(
        "/Accounts/ChangeProfile",
        { avatar: fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchProfile();
      showToast({
        message: "Cập nhật ảnh đại diện thành công",
        type: "success",
      });
    } catch (error) {
      console.error("Lỗi cập nhật avatar:", error);
      showToast({ message: "Cập nhật ảnh đại diện thất bại", type: "error" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [params]);

  const handleEmailUpdated = (newEmail: string) => {
    if (profile) {
      setProfile({ ...profile, email: newEmail });
      console.log("Updated profile:", { ...profile, email: newEmail });
    }
  };

  const handlePhoneUpdated = (newPhone: string) => {
    if (profile) {
      setProfile({ ...profile, phone: newPhone });
      console.log("Updated profile:", { ...profile, phone: newPhone });
    }
  };

  const handleNameUpdated = (newName: string) => {
    if (profile) {
      setProfile({ ...profile, fullName: newName });
      console.log("Updated profile:", { ...profile, fullName: newName });
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
              "https://t3.ftcdn.net/jpg/11/69/54/34/360_F_1169543439_7AxjAvV0GnwlEo3IIqlCGqiF3UFJfTAe.jpg",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.avatarOverlay}
          onPress={() => setShowWebView(true)}
        >
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
          fetchProfile={fetchProfile}
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
            {profile.phone ? "Thêm" : "Không thể sửa"}
          </Text>
        </TouchableOpacity>
        <EmailModal
          visible={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          title="Địa chỉ email"
          content={profile.email || ""}
          onUpdateEmail={handleEmailUpdated}
          fetchProfile={fetchProfile}
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
            {profile.email ? "Thêm" : "Không thể sửa"}
          </Text>
        </TouchableOpacity>
        <PhoneModal
          visible={showPhoneModal}
          onClose={() => setShowPhoneModal(false)}
          title="Số điện thoại"
          content={profile.phone || ""}
          onUpdatePhone={handlePhoneUpdated}
          fetchProfile={fetchProfile}
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

      <Modal
        visible={showWebView}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowWebView(false)}
        statusBarTranslucent={true}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <FileUploadWebView
            token={`User${profile.id}`}
            onFileSelected={(fileUrl) => updateAvatarUrl(fileUrl)}
            onClose={() => setShowWebView(false)}
          />
        </SafeAreaView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ProfileUpdateScreen;
