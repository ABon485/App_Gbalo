import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ImageBackground, 
  StatusBar, 
  TextInput, 
  StyleSheet,
  ActivityIndicator 
} from "react-native"
import { Stack, useLocalSearchParams, router } from "expo-router"
import { useToast } from "@/context/ToastContext"
import AsyncStorage from "@react-native-async-storage/async-storage" 
import authApi from "@/services/auth"
import type { TextInput as RNTextInput } from "react-native"

const VerifyPhoneScreen = () => {
  const { phoneNumber } = useLocalSearchParams()
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<Array<RNTextInput | null>>([])
  const { showToast } = useToast()

  // Timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendDisabled, countdown]);

  // Format phone number to display with asterisks
  const formatPhoneNumber = (phone: string | string[] | undefined) => {
    if (!phone) return ""
    const phoneStr = String(phone)
    if (phoneStr.length <= 4) return phoneStr

    const firstPart = phoneStr.substring(0, 3)
    const lastPart = phoneStr.substring(phoneStr.length - 3)
    const middlePart = "*".repeat(Math.min(4, phoneStr.length - 6))

    return `${firstPart}${middlePart}${lastPart}`
  }

  // Handle code input change
  const handleCodeChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...verificationCode]
      newCode[index] = text
      setVerificationCode(newCode)

      // Auto-focus next input
      if (text && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
      
      // Auto-verify when all digits entered
      if (text && index === 5) {
        // Check if we have all 6 digits
        const codeComplete = newCode.every(digit => digit !== "")
        if (codeComplete) {
          handleContinue(newCode.join(""))
        }
      }
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle resend OTP
  const handleResend = async () => {
    if (resendDisabled) return
    
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem("loginToken")
      
      if (!token) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác thực. Vui lòng thử lại."
        })
        return
      }
      
      // Gọi API gửi lại mã OTP
      const sendCodeData: SendCodeLogin = {
        sendType: "Phone",
        phone: phoneNumber as string,
        email: ""
      }
      
      const response = await authApi.loginSendCode(sendCodeData)
      
      if (response.data?.success) {
        setResendDisabled(true)
        showToast({
          type: "success",
          message: "Đã gửi lại mã xác nhận!"
        })
        
        // Reset mã OTP
        setVerificationCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      } else {
        showToast({
          type: "error",
          message: response.data?.message || "Không thể gửi lại mã"
        })
      }
    } catch (error) {
      console.error("Lỗi khi gửi lại mã:", error)
      showToast({
        type: "error",
        message: "Đã xảy ra lỗi khi gửi lại mã xác nhận"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle continue button press with OTP verification
  const handleContinue = async (code?: string) => {
    const verifyCode = code || verificationCode.join("")
    
    if (verifyCode.length < 6) {
      showToast({
        type: "error",
        message: "Vui lòng nhập đầy đủ mã xác nhận"
      })
      return
    }
    
    try {
      setIsLoading(true)
      
      const token = await AsyncStorage.getItem("loginToken")
      
      if (!token) {
        showToast({
          type: "error",
          message: "Không tìm thấy token xác thực. Vui lòng thử lại."
        })
        return
      }
      
      // Gọi API xác thực OTP
      const verifyData = {
        publicKey: token,
        code: "123456" // Sử dụng mã mặc định
      }
      
      const response = await authApi.loginByCode(verifyData)
      
      if (response.data?.success) {
        // Lưu thông tin đăng nhập
        if (response.data?.data?.token) {
          await AsyncStorage.setItem("data", JSON.stringify({
            token: response.data.data.token,
            user: response.data.data.user
          }))
        }
        
        showToast({
          type: "success",
          message: "Đăng nhập thành công!"
        })
        
        // Chuyển đến màn hình chính
        router.push("/(tabs)/assistant")
      } else {
        showToast({
          type: "error",
          message: response.data?.message || "Mã xác nhận không đúng"
        })
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error)
      showToast({
        type: "error",
        message: "Đã xảy ra lỗi khi xác thực. Vui lòng thử lại."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isCodeComplete = verificationCode.join("").length === 6

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("@/assets/images/BackGroud.png")}
        style={styles.backgroundImage}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/imagLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Xác thực số điện thoại của bạn</Text>
              <Text style={styles.subtitle}>Vui lòng nhập mã xác nhận vừa gửi qua SĐT</Text>

              <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>

              <View style={styles.codeInputContainer}>
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    editable={!isLoading}
                  />
                ))}
              </View>

              <Text style={styles.hintText}>
                Mã xác nhận mặc định là: <Text style={styles.hintHighlight}>123456</Text>
              </Text>

              <TouchableOpacity
                style={[
                  styles.continueButton, 
                  isCodeComplete ? styles.activeButton : styles.inactiveButton,
                  isLoading && styles.loadingButton
                ]}
                onPress={() => handleContinue()}
                disabled={!isCodeComplete || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text 
                    style={[
                      styles.continueButtonText, 
                      isCodeComplete ? styles.activeButtonText : styles.inactiveButtonText
                    ]}
                  >
                    Tiếp tục
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton} 
                onPress={handleResend}
                disabled={resendDisabled || isLoading}
              >
                <Text style={[styles.resendText, resendDisabled && styles.disabledText]}>
                  {resendDisabled ? `Gửi lại sau (${countdown}s)` : "Gửi lại mã"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 90,
  },
  logo: {
    width: '50%',
    height: '15%',
    marginBottom: "auto",
  },
  formContainer: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF5722',
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  codeInput: {
    width: 40,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  hintHighlight: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: '#FF5722',
  },
  inactiveButton: {
    backgroundColor: '#ddd',
  },
  loadingButton: {
    opacity: 0.7,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: '#666',
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: '#999',
  }
})

export default VerifyPhoneScreen