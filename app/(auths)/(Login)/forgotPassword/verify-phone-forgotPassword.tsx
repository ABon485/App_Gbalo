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
    StyleSheet
} from "react-native"
import { Stack, useLocalSearchParams, router } from "expo-router"

const VerifyPhoneForgotPasswordScreen = () => {
    const { phoneNumber } = useLocalSearchParams() // Get phoneNumber from params
    const [otp, setOtp] = useState(["", "", "", "", "", ""]) // Array to store 6 OTP digits
    const [otpError, setOtpError] = useState(false)

    // Handle OTP input change
    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input if a digit is entered
        if (value && index < 5) {
            const nextInput = `otpInput${index + 1}`
            // Focus next input (you may need to use refs for focusing in React Native)
        }
    }

    // Check if OTP is fully entered
    const isOtpComplete = otp.every(digit => digit !== "")

    // Handle Continue button press
    const handleContinue = () => {
        if (isOtpComplete) {
            // Add logic to verify OTP here
            router.push("/(auths)/(Login)/forgotPassword/reset-password") // Navigate to reset password screen
        } else {
            setOtpError(true)
        }
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
                            <Text style={styles.headerText}>Xác thực số điện thoại của bạn</Text>
                            <Text style={styles.subHeaderText}>Vui lòng nhập mã xác nhận vừa gửi qua SDT</Text>
                            <Text style={styles.phoneNumberText}>
                                {phoneNumber?.toString().replace(/^(\d{3})\d{4}(\d{3})$/, "$1****$2")}
                            </Text>

                            {/* OTP Input Fields */}
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={[
                                            styles.otpInput,
                                            otpError && !digit && styles.otpErrorInput,
                                        ]}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(value, index)}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        textContentType="oneTimeCode"
                                    />
                                ))}
                            </View>

                            {/* Continue Button */}
                            <TouchableOpacity
                                style={[styles.continueButton, !isOtpComplete && styles.disabledButton]}
                                onPress={handleContinue}
                                disabled={!isOtpComplete}
                            >
                                <Text style={[styles.buttonText, !isOtpComplete && styles.disabledButtonText]}>
                                    Tiếp tục
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
    marginBottom: 10,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  phoneNumberText: {
    fontSize: 16,
    color: "#FF5722",
    marginBottom: 30,
    fontFamily: "Inter-Medium",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    borderColor: "#D1D5DB",
  },
  otpErrorInput: {
    borderColor: "red",
  },
  continueButton: {
    width: "100%",
    height: 43,
    backgroundColor: "#FF5722",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Inter-Medium",
  },
  disabledButtonText: {
    color: "#A1A1A1",
  },
})

export default VerifyPhoneForgotPasswordScreen
