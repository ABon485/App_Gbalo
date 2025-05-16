import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "@/styles/auth/register/registerPhone";
import { useRouter } from "expo-router";
import CustomButtonRN from "@/components/common/customButtonRN";
import { useToast } from "@/context/ToastContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/config/api";
import { ApiResponse } from "@/types/api";
import { RegistercodeByPhone } from "@/types/user";

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();

   const countryPhoneCodes = [
    { name: "Việt Nam", code: "+84" },
    { name: "Hoa Kỳ", code: "+1" },
    { name: "Anh", code: "+44" },
    { name: "Pháp", code: "+33" },
    { name: "Đức", code: "+49" },
    { name: "Nhật Bản", code: "+81" },
    { name: "Hàn Quốc", code: "+82" },
    { name: "Trung Quốc", code: "+86" },
    { name: "Thái Lan", code: "+66" },
    { name: "Singapore", code: "+65" },
    { name: "Úc", code: "+61" },
    { name: "Canada", code: "+1" },
    { name: "Ấn Độ", code: "+91" },
    { name: "Malaysia", code: "+60" },
    { name: "Indonesia", code: "+62" },
    { name: "Philippines", code: "+63" },
    { name: "Nga", code: "+7" },
    { name: "Brazil", code: "+55" },
    { name: "Mexico", code: "+52" },
    { name: "Tây Ban Nha", code: "+34" },
    { name: "Ý", code: "+39" },
    { name: "Hà Lan", code: "+31" },
    { name: "Thụy Sĩ", code: "+41" },
    { name: "Thụy Điển", code: "+46" },
    { name: "Na Uy", code: "+47" },
    { name: "Đan Mạch", code: "+45" },
    { name: "New Zealand", code: "+64" },
    { name: "Nam Phi", code: "+27" },
    { name: "Argentina", code: "+54" },
    { name: "Chile", code: "+56" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countryPhoneCodes[0]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => router.push("/(auths)/(Login)/login");
  const handleRegisterEmail = () =>
    router.push("/(auths)/(register)/registerEmail/RegisterEmail");

  const verifyPhone = async () => {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const fullPhone = `${selectedCountry.code}${phoneNumber}`;
    if (!phoneNumber) {
      showToast({ type: "error", message: "Vui lòng nhập số điện thoại" });
      return;
    }
    if (!phoneRegex.test(fullPhone)) {
      showToast({ type: "error", message: "Số điện thoại không hợp lệ" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<ApiResponse<RegistercodeByPhone>>(
        "/Accounts/SendResgiterCode",
        { phone: phoneNumber }
      );
      const receivedToken = response.data?.data?.token;
      if (receivedToken) {
        await AsyncStorage.setItem("registerToken", receivedToken);
        showToast({
          type: "success",
          message: "Mã xác minh đã được gửi tới số điện thoại của bạn",
        });
        router.push({
          pathname: "/(auths)/(register)/registerPhone/veryfyPhone",
          params: { phone: fullPhone },
        });
      } else {
        showToast({
          type: "error",
          message: "Không nhận được token từ server",
        });
      }
    } catch (error: any) {
      showToast({ type: "error", message: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const selectCountry = (country: { name: string; code: string }) => {
    setSelectedCountry(country);
    closeModal();
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/BackGroud.png")}
      style={styles.backgroundImage}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.topHalf}>
            <Image
              source={require("../../../../assets/images/imagLogo.png")}
              resizeMode="contain"
              style={{ width: 180, height: 100 }}
            />
          </View>

          <View style={styles.bottomHalf}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Đăng ký</Text>

              <TouchableOpacity
                onPress={openModal}
                style={styles.countryPhoneHeader}
              >
                <View style={styles.countrySelectRow}>
                  <Text style={styles.countryPhoneLabel}>Quốc gia/Khu vực</Text>
                  <AntDesign
                    name="down"
                    size={16}
                    color="#000"
                    style={styles.downIcon}
                  />
                </View>
                <Text style={styles.countryPhoneText}>
                  {selectedCountry.name} ({selectedCountry.code})
                </Text>
                <View style={styles.countryPhoneDivider} />
                <TextInput
                  placeholder="Số điện thoại"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={countryPhoneCodes}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.countryItem}
                          onPress={() => selectCountry(item)}
                        >
                          <Text style={styles.countryItemText}>
                            {item.name} ({item.code})
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>

              <Text style={styles.privacyText}>
                Bằng cách đăng ký hoặc đăng nhập, bạn đã hiểu và đồng ý với
                <Text style={styles.privacyLink}>
                  {" "}
                  Điều Khoản Sử Dụng Chung{" "}
                </Text>
                và
                <Text style={styles.privacyLink}> Chính sách bảo mật</Text> của
                Gbalo
              </Text>

              <CustomButtonRN
                title="Tiếp tục"
                onPress={verifyPhone}
                disabled={loading}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleRegisterEmail}
              >
                <Image
                  source={require("../../../../assets/images/social/email.png")}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/Google.png")}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/Facebook.png")}
                />
                <Text style={styles.socialButtonText}>
                  Tiếp tục với Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../../../assets/images/social/apple.png")}
                />
                <Text style={styles.socialButtonText}>Tiếp tục với Apple</Text>
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
