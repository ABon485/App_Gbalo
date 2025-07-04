"use client";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  FileText,
  Tag,
  CreditCard,
  Lock,
  Bell,
  Globe,
  ChevronRight,
  User,
} from "lucide-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";
import api from "@/config/api";
import { ProfileResponse } from "@/types/user";
import AntDesign from "@expo/vector-icons/AntDesign";
import DeleteAccountModal from "@/components/profile/deleteAcount";
import ConfirmLogoutModal from "@/components/profile/confirmlogout";
import styles from "@/styles/profile/profile";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import authApi from "@/services/auth"; // Import authApi to access deleteAccount


export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<ProfileResponse["data"] | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const parsedData = JSON.parse(data);
      const token = parsedData.token;
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const response = await api.get<ProfileResponse>("/Accounts/Profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data) {
        const userData: ProfileResponse["data"] = {
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
            "",
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
          city: response.data.data.city || parsedData.city || "",
          dateOfBirth: response.data.data.dateOfBirth
            ? new Date(response.data.data.dateOfBirth)
            : parsedData.dateOfBirth
              ? new Date(parsedData.dateOfBirth)
              : new Date(),
          lastChangePassDate:
            response.data.data.lastChangePassDate ||
            parsedData.lastChangePassDate ||
            "",
        };

        setUser(userData);
        setIsLoggedIn(true);

        await AsyncStorage.setItem(
          "data",
          JSON.stringify({
            ...parsedData,
            ...userData,
            token,
          })
        );
      } else {
        throw new Error("No user data in API response");
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
      });

      const parsedData = JSON.parse(
        (await AsyncStorage.getItem("data")) || "{}"
      );
      if (parsedData) {
        const userData: ProfileResponse["data"] = {
          id: parsedData.id || "",
          userName: parsedData.userName || "",
          fullName: parsedData.fullName || "Khách hàng",
          isBanned: parsedData.isBanned ?? false,
          isActive: parsedData.isActive ?? true,
          lastActivityDate:
            parsedData.lastActivityDate || new Date().toISOString(),
          isLockedOut: parsedData.isLockedOut ?? false,
          lastLockoutDate: parsedData.lastLockoutDate || "",
          email: parsedData.email || "Không có email",
          avatar: parsedData.avatar || "",
          createDate: parsedData.createDate || new Date().toISOString(),
          roles: parsedData.roles || [],
          permissions: parsedData.permissions || [],
          phone: parsedData.phone || "",
          language: parsedData.language || "vi",
          address: parsedData.address || "",
          nationality: parsedData.nationality || "",
          city: parsedData.city || "",
          dateOfBirth: parsedData.dateOfBirth
            ? new Date(parsedData.dateOfBirth)
            : new Date(),
          lastChangePassDate: parsedData.lastChangePassDate || "",
        };
        setUser(userData);
        setIsLoggedIn(true);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogin = () => {
    router.push("/(auths)/(Login)/login");
  };

  const handleRegister = () => {
    router.replace("/(auths)/(register)/registerPhone/RegisterPhone");
  };

  const handleLogout = async () => {
    if (loadingLogout) return;
    setLoadingLogout(true);
    try {
      await AsyncStorage.removeItem("data");
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      showToast({
        type: "success",
        heading: "Thành công",
        message: "Đăng xuất thành công!",
      });
      router.replace("/(auths)/(Login)/login");
    } catch (error) {
      console.error("Error in handleLogout:", error);
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Đăng xuất thất bại, vui lòng thử lại",
      });
    } finally {
      setLoadingLogout(false);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      if (!data) {
        showToast({
          type: "error",
          heading: "Lỗi",
          message: "Không tìm thấy thông tin người dùng.",
        });
        return;
      }

      const parsedData = JSON.parse(data);
      const token = parsedData.token;
      if (!token) {
        showToast({
          type: "error",
          heading: "Lỗi",
          message: "Không tìm thấy token xác thực.",
        });
        return;
      }

      const response = await authApi.deleteAccount();
      if (response.data.status === "Success" && response.data.data === true) {
        await AsyncStorage.removeItem("data");
        await AsyncStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setShowDeleteAccountModal(false);
        showToast({
          type: "success",
          heading: "Thành công",
          message: "Tài khoản đã được xóa!",
        });
        router.replace("/(auths)/(Login)/login");
      } else {
        throw new Error("Xóa tài khoản không thành công");
      }
    } catch (error) {
      console.error("Error in handleDeleteAccount:", error);
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Xóa tài khoản thất bại, vui lòng thử lại",
      });
    }
  };

  const handleUpdateProfile = () => {
    router.push("/(screens)/profile/profile");
  };

  const menuItems = [
    {
      id: 1,
      title: "Đơn hàng",
      icon: <FileText size={20} color="#333" />,
      action: () => router.push("/(screens)/tourOder/page"),
    },
    {
      id: 2,
      title: "Ưu đãi của tôi",
      icon: <Tag size={20} color="#333" />,
      action: () => router.push("/"),
    },
    {
      id: 3,
      title: "Phương thức thanh toán",
      icon: <CreditCard size={20} color="#333" />,
      action: () => router.push("/"),
    },
    {
      id: 4,
      title: "Đánh giá của tôi",
      icon: (
        <MaterialCommunityIcons
          name="comment-text-outline"
          size={20}
          color="#333"
        />
      ),
      action: () => router.push("/(screens)/rating/myRating"),
    },
    {
      id: 5,
      title: "Đăng nhập và mật khẩu",
      icon: <MaterialCommunityIcons name="shield-lock-outline" size={21} color="#333" />,
      action: () => router.push("/(screens)/profile/loginSecurity"),
    },
    {
      id: 6,
      title: "Cài đặt thông báo",
      icon: <Bell size={20} color="#333" />,
      action: () => router.push("/"),
    },
    {
      id: 7,
      title: "Ngôn ngữ",
      icon: <Ionicons name="language" size={20} color="#333" />,
      action: () => router.push("/(screens)/language/language"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileHeader}>Hồ sơ</Text>

          {isLoggedIn && user ? (
            <View>
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri:
                      user.avatar ||
                      "https://t3.ftcdn.net/jpg/11/69/54/34/360_F_1169543439_7AxjAvV0GnwlEo3IIqlCGqiF3UFJfTAe.jpg",
                  }}
                  style={styles.userAvatar}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.fullName}</Text>
                  <TouchableOpacity
                    onPress={handleUpdateProfile}
                    style={styles.updateProfileButton}
                  >
                    <View style={styles.updateProfileButtonContent}>
                      <Text style={styles.updateProfileText}>
                        Cập nhật thông tin cá nhân
                      </Text>
                      <AntDesign
                        name="right"
                        size={16}
                        color="#007BFF"
                        style={{ marginLeft: 14, marginTop: 2 }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    Bạn đang là thành viên bạc{"\n"}
                  </Text>
                  <Text>
                    Cần{" "}
                    <Text style={{ color: "red", fontWeight: "bold" }}>
                      120
                    </Text>{" "}
                    điểm nữa để đạt hạng Vàng
                  </Text>
                </Text>

                <View style={styles.iconWrapper}>
                  <Image
                    source={require("@/assets/images/home/level.png")}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.loginInfo}>
                <View style={styles.defaultAvatar}>
                  <User size={30} color="#999" />
                </View>
                <View style={styles.loginButtons}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                  >
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                  >
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  Đăng ký/Đăng nhập để trở thành thành viên và nhận được nhiều
                  voucher từ Gbalo
                </Text>
                <View style={styles.iconWrapper}>
                  <FileText size={18} color="#999" />
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.action}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 ? styles.menuItemBorder : {},
              ]}
            >
              <View style={styles.menuItemContent}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={18} color="#999" />
            </TouchableOpacity>
          ))}

          {isLoggedIn && (
            <>
              <TouchableOpacity
                style={[styles.menuItem, styles.logoutButton]}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>

              <ConfirmLogoutModal
                visible={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
              />

              <TouchableOpacity
                style={[styles.menuItem, styles.DeleteButton]}
                onPress={() => setShowDeleteAccountModal(true)}
              >
                <Text style={styles.DeleteAcount}>Xóa tài khoản</Text>
              </TouchableOpacity>

              <DeleteAccountModal
                visible={showDeleteAccountModal}
                onClose={() => setShowDeleteAccountModal(false)}
                onDelete={handleDeleteAccount}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
