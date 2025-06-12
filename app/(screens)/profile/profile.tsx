import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  StyleSheet,
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
import ImageGalleryModal from "@/components/rating/ImageGalleryModal";

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
  const [imageList, setImageList] = useState<string[]>([]);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProfile = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) {
        showToast({
          type: "error",
          message: "Không tìm thấy thông tin người dùng",
        });
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(data);
      const token = parsedData.token;
      if (!token) {
        showToast({ type: "error", message: "Không tìm thấy token" });
        setLoading(false);
        return;
      }

      const response = await api.get<ProfileResponse>("/Accounts/Profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data) {
        const profileData: ProfileResponse["data"] = {
          id: response.data.data.id || parsedData.id || "",
          userName: response.data.data.userName || parsedData.userName || "",
          fullName:
            response.data.data.fullName || parsedData.fullName || "Khách hàng",
          isBanned: response.data.data.isBanned ?? parsedData.isBanned ?? false,
          isActive: response.data.data.isActive ?? parsedData.isActive ?? true,
          lastActivityDate:
            response.data.data.lastActivityDate ||
            parsedData.lastActivityDate ||
            new Date().toISOString(),
          isLockedOut:
            response.data.data.isLockedOut ?? parsedData.isLockedOut ?? false,
          lastLockoutDate:
            response.data.data.lastLockoutDate ||
            parsedData.lastLockoutDate ||
            new Date().toISOString(),
          email:
            response.data.data.email || parsedData.email || "Không có email",
          avatar: response.data.data.avatar || parsedData.avatar || "",
          createDate:
            response.data.data.createDate ||
            parsedData.createDate ||
            new Date().toISOString(),
          roles: response.data.data.roles || parsedData.roles || [],
          permissions:
            response.data.data.permissions || parsedData.permissions || [],
          phone: response.data.data.phone || parsedData.phone || "",
          language: response.data.data.language || parsedData.language || "vi",
          address: response.data.data.address || parsedData.address || "",
          nationality:
            response.data.data.nationality || parsedData.nationality || "",
          dateOfBirth:
            response.data.data.dateOfBirth ||
            parsedData.dateOfBirth ||
            new Date().toISOString(),
          lastChangePassDate:
            response.data.data.lastChangePassDate ||
            parsedData.lastChangePassDate ||
            new Date().toISOString(),
        };

        setProfile(profileData);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ ...parsedData, ...profileData, token })
        );
      } else {
        throw new Error("Không có dữ liệu trả về từ API");
      }
    } catch (error) {
      console.error("Lỗi khi fetch profile:", error);
      showToast({ type: "error", message: "Không thể tải hồ sơ" });

      const parsedData = JSON.parse(
        (await AsyncStorage.getItem("data")) || "{}"
      );
      if (parsedData) {
        const profileData: ProfileResponse["data"] = {
          id: parsedData.id || "",
          userName: parsedData.userName || "",
          fullName: parsedData.fullName || "Khách hàng",
          isBanned: parsedData.isBanned ?? false,
          isActive: parsedData.isActive ?? true,
          lastActivityDate:
            parsedData.lastActivityDate || new Date().toISOString(),
          isLockedOut: parsedData.isLockedOut ?? false,
          lastLockoutDate:
            parsedData.lastLockoutDate || new Date().toISOString(),
          email: parsedData.email || "Không có email",
          avatar: parsedData.avatar || "",
          createDate: parsedData.createDate || new Date().toISOString(),
          roles: parsedData.roles || [],
          permissions: parsedData.permissions || [],
          phone: parsedData.phone || "",
          language: parsedData.language || "vi",
          address: parsedData.address || "",
          nationality: parsedData.nationality || "",
          dateOfBirth: parsedData.dateOfBirth
            ? typeof parsedData.dateOfBirth === "string"
              ? parsedData.dateOfBirth
              : new Date(parsedData.dateOfBirth).toISOString()
            : new Date().toISOString(),
          lastChangePassDate:
            parsedData.lastChangePassDate || new Date().toISOString(),
        };
        setProfile(profileData);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAvatarUrl = async (fileUrl: string) => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) throw new Error("Không tìm thấy thông tin người dùng");

      const parsedData = JSON.parse(data);
      const token = parsedData.token;
      if (!token) throw new Error("Token không tồn tại");

      await api.post(
        "/Accounts/ChangeAvatar",
        {
          avatar: fileUrl,
          fullName: parsedData.fullName || profile?.fullName || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (profile) {
        setProfile({ ...profile, avatar: fileUrl });
      }

      await AsyncStorage.setItem(
        "data",
        JSON.stringify({
          ...parsedData,
          avatar: fileUrl,
        })
      );

      showToast({
        type: "success",
        message: "Cập nhật ảnh đại diện thành công",
      });
    } catch (error) {
      console.error("Lỗi cập nhật avatar:", error);
      showToast({ type: "error", message: "Thất bại khi cập nhật avatar" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNameUpdated = async (newName: string) => {
    if (profile) {
      setProfile({ ...profile, fullName: newName });
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ ...parsedData, fullName: newName })
        );
      }
    }
  };

  const handleEmailUpdated = async (newEmail: string) => {
    if (profile) {
      setProfile({ ...profile, email: newEmail });
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ ...parsedData, email: newEmail })
        );
      }
    }
  };

  const handlePhoneUpdated = async (newPhone: string) => {
    if (profile) {
      setProfile({ ...profile, phone: newPhone });
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ ...parsedData, phone: newPhone })
        );
      }
    }
  };

  const handleAddressUpdated = async (newAddress: string) => {
    if (profile) {
      setProfile({ ...profile, address: newAddress });
      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        await AsyncStorage.setItem(
          "data",
          JSON.stringify({ ...parsedData, address: newAddress })
        );
      }
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cập nhật thông tin cá nhân</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() => {
              setImageList([
                profile.avatar ||
                  "https://t3.ftcdn.net/jpg/11/69/54/34/360_F_1169543439_7AxjAvV0GnwlEo3IIqlCGqiF3UFJfTAe.jpg",
              ]);
              setSelectedImageIndex(0);
              setIsImageViewerVisible(true);
            }}
          >
            <Image
              source={{
                uri:
                  profile.avatar ||
                  "https://t3.ftcdn.net/jpg/11/69/54/34/360_F_1169543439_7AxjAvV0GnwlEo3IIqlCGqiF3UFJfTAe.jpg",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
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
        <ImageGalleryModal
          visible={isImageViewerVisible}
          images={imageList}
          index={selectedImageIndex}
          onClose={() => setIsImageViewerVisible(false)}
        />

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
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profile.email || "Chưa cung cấp"}</Text>
          </View>
          {/* {!profile.email && ( */}
            <TouchableOpacity onPress={() => setShowEmailModal(true)}>
              <Text style={styles.editButton}>Thêm</Text>
            </TouchableOpacity>
          {/* )} */}
          <EmailModal
            visible={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            title="Email"
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
          {/* {!profile.phone && ( */}
            <TouchableOpacity onPress={() => setShowPhoneModal(true)}>
              <Text style={styles.editButton}>Thêm</Text>
            </TouchableOpacity>
          {/* )} */}
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
            <Text style={styles.value}>
              {profile.address || "Chưa cung cấp"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddressModal(true)}>
            <Text style={styles.editButton}>Thêm</Text>
          </TouchableOpacity>
          <AddressModal
            visible={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            title="Địa chỉ"
            content={profile.address || ""}
            onUpdate={handleAddressUpdated}
            fetchProfile={fetchProfile}
          />
        </View>

        <Modal
          visible={showWebView}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowWebView(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <FileUploadWebView
              token={`User${profile.id}`}
              onFileSelected={updateAvatarUrl}
              onClose={() => setShowWebView(false)}
            />
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
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
    width: 120,
    height: 120,
    borderRadius: 80,
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
    paddingHorizontal: 20,
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
