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
        // Log bước lấy dữ liệu từ AsyncStorage
        console.log("Fetching data from AsyncStorage with key: 'data'");
        const data = await AsyncStorage.getItem("data");

        if (!data) {
          console.warn("No data found in AsyncStorage for key: 'data'");
          return;
        }

        // Parse dữ liệu
        const parsedData = JSON.parse(data);
        console.log("Parsed AsyncStorage data:", parsedData);

        const token = parsedData.token;
        console.log("Token profile:", token);
        if (!token) {
          console.warn("No token found in parsed AsyncStorage data");
          return;
        }

        // Biến để bật/tắt chế độ hardcode
        const IS_HARDCODE_MODE = true;

        if (IS_HARDCODE_MODE) {
          // Giả lập dữ liệu hồ sơ từ AsyncStorage
          const fullName = parsedData.fullName || "Khách hàng";
          const email = parsedData.email || "Không có email";

          setUser({
            id: parsedData.id || "",
            userName: parsedData.userName || "",
            fullName,
            email,
            avatar: parsedData.avatar || "",
            createDate: parsedData.createDate || "",
            roles: parsedData.roles || [],
            permissions: parsedData.permissions || [],
            phone: parsedData.phone || "",
            language: parsedData.language || "",
            address: parsedData.address || "",
            nationality: parsedData.nationality || "",
            dateOfBirth: parsedData.dateOfBirth
              ? new Date(parsedData.dateOfBirth)
              : new Date(),
          });
          setIsLoggedIn(true);
          console.log("Hardcode mode: Set user data:", { fullName, email });
          console.log("Set isLoggedIn to true");
        } else {
          // Gọi API thật khi server sẵn sàng
          console.log("Fetching profile from API with token:", token);
          const response = await api.get("/Accounts/Profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("API response:", response);
          console.log("API response data:", response.data);

          if (response?.data?.data) {
            const fullNameFromAPI = response.data.data.fullName;
            const fullName =
              fullNameFromAPI || parsedData.fullName || "Khách hàng";

            setUser({
              ...response.data.data,
              fullName,
            });
            setIsLoggedIn(true);
            console.log("Set user data from API:", {
              ...response.data.data,
              fullName,
            });
            console.log("Set isLoggedIn to true");
          } else {
            console.warn("No user data in API response");
          }
        }
      } catch (error: any) {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          const fullName = parsedData.fullName || "Khách hàng";
          const email = parsedData.email || "Không có email";

          setUser({
            id: parsedData.id || "",
            userName: parsedData.userName || "",
            fullName,
            email,
            avatar: parsedData.avatar || "",
            createDate: parsedData.createDate || "",
            roles: parsedData.roles || [],
            permissions: parsedData.permissions || [],
            phone: parsedData.phone || "",
            language: parsedData.language || "",
            address: parsedData.address || "",
            nationality: parsedData.nationality || "",
            dateOfBirth: parsedData.dateOfBirth
              ? new Date(parsedData.dateOfBirth)
              : new Date(),
          });
          setIsLoggedIn(true);
          console.log("Fallback: Set user data from AsyncStorage:", {
            fullName,
            email,
          });
        } else {
          console.warn("Fallback failed: No data in AsyncStorage");
        }
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
      setIsLoggedIn(false);
      setUser(null);
      showToast({
        type: "success",
        heading: "Thành công",
        message: "Đăng xuất thành công!",
      });
      router.replace("/(auths)/(Login)/login");
    } catch (error) {
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
    if (user) {
      router.push({
        pathname: "/(screens)/profile/profile",
        params: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
          userName: user.userName,
          createDate: user.createDate,
          language: user.language,
          nationality: user.nationality,
          dateOfBirth: user.dateOfBirth.toISOString(), // Chuyển Date thành chuỗi
        },
      });
    } else {
      console.warn("Không có dữ liệu người dùng để truyền");
      router.push("/(screens)/profile/profile");
    }
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

          {isLoggedIn ? (
            <View>
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri:
                      user?.avatar ||
                      "https://t3.ftcdn.net/jpg/11/69/54/34/360_F_1169543439_7AxjAvV0GnwlEo3IIqlCGqiF3UFJfTAe.jpg",
                  }}
                  style={styles.userAvatar}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {user?.fullName ?? "Khách hàng"}
                  </Text>
                  <TouchableOpacity
                    onPress={handleUpdateProfile}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#E4EFE7",
                    }}
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

              {/* Thành viên khi đã đăng nhập */}
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  Bạn đang là thành viên bạc{"\n"}Cần 120 điểm nữa để đạt hạng
                  Vàng
                </Text>
                <Text></Text>
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
                    <Text style={styles.registerButtonText}>Đăng kí</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Khi chưa đăng nhập */}
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
            </>
          )}

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
