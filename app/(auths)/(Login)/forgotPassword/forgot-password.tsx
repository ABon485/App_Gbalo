"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
  StyleSheet
} from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import { Stack, router } from "expo-router"
import authApi from "@/services/auth"
import { SendCodeLogin } from "@/types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "@/context/ToastContext"

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
]

const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countryPhoneCodes[0])
  const [isModalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleSendCode = async () => {
    // Normalize phone number: remove non-digits and leading zeros
    const normalizedPhone = phoneNumber.replace(/\D/g, "").replace(/^0+/, "")
    const fullPhoneNumber = `${selectedCountry.code}${normalizedPhone}`

    // Validate phone number
    if (!phoneNumber.trim()) {
      showToast({ type: "error", message: "Vui lòng nhập số điện thoại." })
      return
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!phoneRegex.test(fullPhoneNumber) || /\D/.test(normalizedPhone)) {
      showToast({ type: "error", message: "Số điện thoại không hợp lệ." })
      return
    }

    // Validate Vietnam phone number length
    if (selectedCountry.code === "+84" && normalizedPhone.length !== 9) {
      showToast({
        type: "error",
        message: "Số điện thoại Việt Nam phải có 9 chữ số (không tính mã quốc gia).",
      })
      return
    }

    setIsLoading(true)
    try {
      const sendCodePayload: SendCodeLogin = {
        sendType: "phone",
        phone: phoneNumber,

      }

      const response = await authApi.loginSendCode(sendCodePayload)
      console.log("API response:", response)

      if (response.data?.success || response.data?.status === "Success") {
        const publicKey = response.data.data?.publicKey || ""
        await AsyncStorage.setItem("forgotPasswordToken", publicKey)

        showToast({
          type: "success",
          message: "Mã xác nhận đã được gửi. Trong môi trường phát triển, sử dụng mã OTP: 123456",
        })

        router.push({
          pathname: "/(auths)/(Login)/forgotPassword/verify-phone-forgotPassword",
          params: { phoneNumber: fullPhoneNumber },
        })
      } else {
        const errorMsg =
          response.data?.errors?.account?.[0] ||
          response.data?.message ||
          "Số điện thoại chưa được đăng ký."

        showToast({
          type: "error",
          message: errorMsg,
        })

        // Redirect to registration if account doesn't exist
        if (errorMsg.includes("Tài khoản không tồn tại") || errorMsg.includes("Số điện thoại chưa được đăng ký")) {
          setTimeout(() => {
            router.push("/(auths)/(register)/registerPhone/RegisterPhone")
          }, 2000)
        }
      }
    } catch (error: any) {
      console.error("Lỗi gửi mã xác minh:", error.response?.data || error)
      const errorMessage =
        error.response?.data?.errors?.account?.[0] ||
        error.response?.data?.message ||
        "Số điện thoại chưa được đăng ký."

      showToast({
        type: "error",
        message: errorMessage,
      })

      // Redirect to registration if account doesn't exist
      if (errorMessage.includes("Tài khoản không tồn tại") || errorMessage.includes("Số điện thoại chưa được đăng ký")) {
        setTimeout(() => {
          router.push("/(auths)/(register)/registerPhone/RegisterPhone")
        }, 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const selectCountry = (country: { name: string; code: string }) => {
    setSelectedCountry(country)
    closeModal()
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require("@/assets/images/BackGroud.png")} style={styles.background}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require("@/assets/images/imagLogo.png")} style={styles.logo} resizeMode="contain" />

            <View style={styles.formContainer}>
              <Text style={styles.headerText}>Quên mật khẩu</Text>

              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={openModal} style={styles.countryCodeButton}>
                  <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
                  <AntDesign name="down" size={16} color="#000" style={styles.downIcon} />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                />
              </View>

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

              <TouchableOpacity
                style={[styles.sendCodeButton, isLoading && { opacity: 0.6 }]}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                <Text style={styles.sendCodeButtonText}>
                  {isLoading ? "Đang xử lý..." : "Gửi mã xác minh"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: 80,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  logo: {
    width: "50%",
    height: "15%",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 16,
    paddingLeft: 10,
    paddingRight: 20,
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#4B5563",
  },
  downIcon: {
    marginLeft: 5,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingLeft: 10,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  sendCodeButton: {
    width: "100%",
    height: 43,
    backgroundColor: "#FF5722",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  sendCodeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
    padding: 20,
  },
  countryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  countryItemText: {
    fontSize: 16,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
})

export default ForgotPasswordScreen