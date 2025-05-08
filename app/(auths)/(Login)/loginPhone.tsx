import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StatusBar,
  FlatList,
  Modal,
  Alert,
} from "react-native"
import styles from "@/styles/auth/loginPhone"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "@expo/vector-icons/AntDesign"
import { Stack, router } from "expo-router"
import authApi from "@/services/auth"
import { ApiResponse } from "@/types/api"
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

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countryPhoneCodes[0])
  const [isModalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleContinue = async () => {
    const phoneRegex = /^\+?[0-9]{7,15}$/
    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`

    if (!phoneNumber) {
      showToast({ type: "error", message: "Vui lòng nhập số điện thoại." })
      return
    }

    if (!phoneRegex.test(fullPhoneNumber)) {
      showToast({ type: "error", message: "Số điện thoại không hợp lệ." })
      return
    }

    setIsLoading(true)
    try {
      // Kiểm tra xem số điện thoại đã được đăng ký chưa
      // (Giả định: gọi API để kiểm tra số điện thoại)
      
      // Tạo dữ liệu đăng nhập
      const loginData = {
        phone: fullPhoneNumber,
        password: "", 
        rememberMe: true,
      }

      // Gọi API đăng nhập
      const response = await authApi.loginPhone(loginData)
      
      if (response.data?.success) {
        // Nếu đăng nhập thành công, lưu publicKey (token) và chuyển đến trang xác thực
        await AsyncStorage.setItem("loginToken", response.data?.data?.publicKey || "")
        
        showToast({ 
          type: "success", 
          message: "Mã xác nhận đã được gửi đến số điện thoại của bạn" 
        })
        
        // Chuyển đến trang xác thực
        router.push({
          pathname: "/(auths)/(Login)/verify-phone",
          params: {
            phoneNumber: fullPhoneNumber,
          },
        })
      } else {
        // Nếu số điện thoại chưa đăng ký, hiển thị thông báo
        showToast({ 
          type: "error", 
          message: response.data?.message || "Số điện thoại chưa được đăng ký." 
        })
        
        // Có thể chuyển đến trang đăng ký
        // router.push("/(auths)/(register)/registerPhone/RegisterPhone")
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error)
      showToast({ 
        type: "error", 
        message: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại." 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = () => {
    router.push("/(auths)/(Login)/loginEmail")
  }

  const handleRegister = () => {
    router.push("/(auths)/(register)/registerPhone/RegisterPhone")
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
      <ImageBackground
        source={require("../../../assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Đăng nhập</Text>

              <View style={styles.phoneInputContainer}>
                <TouchableOpacity onPress={openModal} style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
                  <AntDesign name="down" size={16} color="#000" style={styles.downIcon} />
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneInput}
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
                style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
                onPress={handleContinue}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Đang xử lý..." : "Tiếp tục"}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.socialButton} onPress={handleEmailLogin}>
                <View style={styles.socialIconContainer}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Email</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <Image source={require("@/assets/images/Google.png")} style={{ width: 24, height: 24 }} />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <View style={styles.socialIconContainer}>
                  <Image source={require("@/assets/images/Facebook.png")} style={{ width: 24, height: 24 }} />
                </View>
                <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

export default LoginScreen