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
            <ImageBackground
                source={require("@/assets/images/BackGroud.png")}
                className="flex-1 w-full h-full"
            >
                <StatusBar translucent backgroundColor="transparent" />
                <SafeAreaView className="flex-1 w-full">
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: "center",
                            width: "100%",
                            paddingTop: 80,
                            paddingBottom: 0,
                            justifyContent: "space-between",
                        }}
                    >
                        <Image
                            source={require("@/assets/images/imagLogo.png")}
                            className="w-1/2 h-[15%] mb-5"
                            resizeMode="contain"
                        />

                        <View className="w-full h-3/4 bg-white rounded-t-3xl px-6 pt-6 pb-5 items-center shadow-lg shadow-black/25">
                            <Text className="text-2xl font-bold mb-2 text-black text-center">
                                Xác thực số điện thoại của bạn
                            </Text>
                            <Text className="text-base text-gray-600 mb-1 text-center">
                                Vui lòng nhập mã xác nhận vừa gửi qua SDT
                            </Text>
                            <Text className="font-bold text-red-500 text-base mb-6 text-center">
                                {phoneNumber?.toString().replace(/^(\d{3})\d{4}(\d{3})$/, "$1****$2")}
                            </Text>     

                            {/* OTP Input Fields */}
                            <View className="flex-row justify-between w-full mb-6">
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        className={`w-12 h-12 border-2 rounded-lg text-center text-base font-bold ${otpError && !digit ? "border-red-500" : "border-gray-300"
                                            }`}
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
                                className={`w-full h-[50px] rounded-full justify-center items-center ${isOtpComplete ? "bg-orange-500" : "bg-gray-300"
                                    }`}
                                onPress={handleContinue}
                                disabled={!isOtpComplete}
                            >
                                <Text
                                    className={`text-base font-bold ${isOtpComplete ? "text-white" : "text-gray-600"
                                        }`}
                                >
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

export default VerifyPhoneForgotPasswordScreen