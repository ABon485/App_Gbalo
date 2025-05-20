"use client";
import { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import {
  FileText,
  Tag,
  CreditCard,
  Star,
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

export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<ProfileResponse["data"] | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching data from AsyncStorage with key: 'data'");
        const data = await AsyncStorage.getItem("data");
        console.log("Data from AsyncStorage:", data);
        if (!data) {
          console.warn("No data found in AsyncStorage for key: 'data'");
          setIsLoggedIn(false);
          return;
        }

        // Parse dữ liệu
        const parsedData = JSON.parse(data);
        console.log("Parsed AsyncStorage data:", parsedData);

        const token = parsedData.token;
        if (!token) {
          console.warn("No token found in parsed AsyncStorage data");
          setIsLoggedIn(false);
          return;
        }

        // Chế độ hardcode để giả lập dữ liệu hồ sơ
        const IS_HARDCODE_MODE = true;

        if (IS_HARDCODE_MODE) {
          const fullName = parsedData.fullName || "Khách hàng";
          const email = parsedData.email || "Không có email";

          const userData: ProfileResponse["data"] = {
            id: parsedData.id || "",
            userName: parsedData.userName || "",
            fullName,
            email,
            avatar: parsedData.avatar || "",
            createDate: parsedData.createDate || new Date().toISOString(),
            roles: parsedData.roles || [],
            permissions: parsedData.permissions || [],
            phone: parsedData.phone || "",
            language: parsedData.language || "vi",
            address: parsedData.address || "",
            nationality: parsedData.nationality || "",
            dateOfBirth: parsedData.dateOfBirth
              ? new Date(parsedData.dateOfBirth)
              : new Date(),
          };

          setUser(userData);
          setIsLoggedIn(true);
          console.log("Hardcode mode: Set user data:", userData);
        } else {
          // Gọi API thật với retry logic
          console.log("Fetching profile from API with token:", token);
          const maxRetries = 3;
          let attempt = 0;

          while (attempt < maxRetries) {
            try {
              const response = await api.get<ProfileResponse>(
                "/Accounts/Profile",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("API response:", response.data);

              if (response.data?.data) {
                const fullNameFromAPI = response.data.data.fullName;
                const fullName =
                  fullNameFromAPI || parsedData.fullName || "Khách hàng";

                const userData: ProfileResponse["data"] = {
                  ...response.data.data,
                  fullName,
                  email:
                    response.data.data.email ||
                    parsedData.email ||
                    "Không có email",
                };

                setUser(userData);
                setIsLoggedIn(true);
                console.log("Set user data from API:", userData);
                return;
              } else {
                console.warn("No user data in API response");
                throw new Error("No user data in API response");
              }
            } catch (error: any) {
              attempt++;
              console.error("API Error (Attempt", attempt, "):", {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
              });

              if (attempt === maxRetries) {
                console.warn(
                  "Max retries reached, falling back to AsyncStorage"
                );
                const fullName = parsedData.fullName || "Khách hàng";
                const email = parsedData.email || "Không có email";

                const userData: ProfileResponse["data"] = {
                  id: parsedData.id || "",
                  userName: parsedData.userName || "",
                  fullName,
                  email,
                  avatar: parsedData.avatar || "",
                  createDate: parsedData.createDate || new Date().toISOString(),
                  roles: parsedData.roles || [],
                  permissions: parsedData.permissions || [],
                  phone: parsedData.phone || "",
                  language: parsedData.language || "vi",
                  address: parsedData.address || "",
                  nationality: parsedData.nationality || "",
                  dateOfBirth: parsedData.dateOfBirth
                    ? new Date(parsedData.dateOfBirth)
                    : new Date(),
                };

                setUser(userData);
                setIsLoggedIn(true);
                console.log(
                  "Fallback: Set user data from AsyncStorage:",
                  userData
                );
              } else {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
              }
            }
          }
        }
      } catch (error: any) {
        console.error("Error in fetchProfile:", {
          message: error.message,
          stack: error.stack,
        });
        showToast({
          type: "error",
          heading: "Lỗi",
          message: "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
        });
      }
    };

    fetchProfile();
  }, []);

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
    } catch (error: any) {
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

  const handleUpdateProfile = () => {
    router.push("/(screens)/profile/profile");
  };

  const menuItems = [
    {
      id: 1,
      title: "Đơn hàng",
      icon: <FileText size={20} color="#333" />,
      action: () => router.push("/"),
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
      icon: <Star size={20} color="#333" />,
      action: () => router.push("/"),
    },
    {
      id: 5,
      title: "Đăng nhập và mật khẩu",
      icon: <Lock size={20} color="#333" />,
      action: () => router.push("/"),
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
      icon: <Globe size={20} color="#333" />,
      action: () => router.push("/"),
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
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <TouchableOpacity
                    onPress={handleUpdateProfile}
                    style={styles.updateProfileButton}
                  >
                    <Text style={styles.updateProfileText}>
                      Cập nhật thông tin cá nhân
                    </Text>
                    <AntDesign
                      name="right"
                      size={14}
                      color="#007BFF"
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  Bạn đang là thành viên bạc{"\n"}Cần 120 điểm nữa để đạt hạng
                  Vàng
                </Text>
                <View style={styles.iconWrapper}>
                  <FontAwesome6 name="medal" size={24} color="gray" />
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
                onDelete={() => {
                  console.log("Tài khoản bị xóa");
                  setShowDeleteAccountModal(false);
                  showToast({
                    type: "success",
                    heading: "Thành công",
                    message: "Tài khoản đã được xóa!",
                  });
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 16,
    padding: 20,
    marginTop: 35,
  },
  profileHeader: {
    fontSize: 24,
    color: "#000",
    marginBottom: 5,
    fontFamily: "Inter-Medium",
  },
  userInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Inter-Medium",
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "Inter",
    marginTop: 4,
  },
  updateProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E4EFE7",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  updateProfileText: {
    fontSize: 14,
    color: "#007BFF",
    fontFamily: "Inter",
  },
  pointsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    color: "#757575",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
    fontFamily: "Inter-Medium",
  },
  iconWrapper: {
    marginLeft: 10,
  },
  loginInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  defaultAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  loginButtons: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 18,
  },
  loginButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 3,
    height: 30,
    width: 100,
  },
  registerButton: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: "#FF5722",
    borderWidth: 1,
    height: 30,
    width: 100,
  },
  loginButtonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },
  registerButtonText: {
    color: "#FF5722",
    fontSize: 13,
    fontFamily: "Inter-Medium",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Medium",
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    textDecorationLine: "underline",
  },
  DeleteButton: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    textAlign: "center",
    justifyContent: "center",
  },
  DeleteAcount: {
    color: "#FF5722",
    fontSize: 14,
    fontFamily: "Inter",
    textDecorationLine: "underline",
  },
});
