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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/context/ToastContext";
import { StyleSheet } from "react-native";


export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ userName?: string } | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setUser(parsedData.user); // Lấy thông tin user từ AsyncStorage
          setIsLoggedIn(true); // Đánh dấu trạng thái đăng nhập
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      }
    };
    checkLoginStatus();
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
    router.push("/(tabs)/homepage");
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

  const renderUserAvatar = () => {
    const firstLetter = user?.userName?.charAt(0).toUpperCase() || "T";
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{firstLetter}</Text>
      </View>
    );
  };

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
                  source={require("@/assets/images/icon.png")}
                  style={styles.userAvatar}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {user?.userName ?? "Khách hàng"}
                  </Text>
                  <TouchableOpacity onPress={handleUpdateProfile}>
                    <Text style={styles.updateProfileText}>
                      Cập nhật thông tin cá nhân
                    </Text>
                  </TouchableOpacity>
                </View>
                {renderUserAvatar()}
              </View>

              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  Đăng ký để trở thành thành viên bạch kim. Cần 120 điểm nữa để
                  đạt hạng Vàng
                </Text>
                <View style={styles.iconWrapper}>
                  <FileText size={18} color="#999" />
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

              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>
                  Đăng ký/Đăng nhập để trở thành thành viên và nhận được nhiều
                  voucher từ Giao
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
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
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
    marginTop: 40,
  },
  profileHeader: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
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
    fontFamily: "Inter-Medium",
  },
  avatarContainer: {
    backgroundColor: "#9C27B0",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
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
    marginTop:18
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
    marginTop: 20,
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
    color: "#FF5722",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});
