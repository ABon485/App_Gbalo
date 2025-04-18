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
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Stack, router } from "expo-router"

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Password validation checks
    const isMinLength = password.length >= 8
    const isSpecialChar = /[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    // Handle Reset and Login
    const handleResetAndLogin = () => {
        if (isMinLength && isSpecialChar) {
            // Add logic to reset password and log in
            router.push("/(auths)/(Login)/login") // Navigate to login screen after reset
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
                            <Text className="text-2xl  mb-6 text-black text-center" style={{ fontFamily:"Inter-Black"  }}>
                                Đặt lại mật khẩu
                            </Text>

                            {/* Password Input Field */}
                            <View className="flex-row items-center w-full h-[50px] border border-gray-300 rounded-full mb-4 pl-1 pr-4">
                                <TextInput
                                    className="flex-1 h-full text-base px-2 text-gray-800"
                                    style={{ fontFamily:"Inter-Medium"  }}
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor="#999999"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <MaterialIcons
                                        name={showPassword ? "visibility" : "visibility-off"}
                                        size={20}
                                        color="#999999"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Password Requirements */}
                            <View className="w-full mb-6">
                                <View className="flex-row items-center mb-2">
                                    <MaterialIcons
                                        name={isMinLength ? "check-circle" : "cancel"}
                                        size={16}
                                        color={isMinLength ? "green" : "red"}
                                    />
                                    <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily:"Inter-Medium"}}>
                                        Dài ít nhất 8 ký tự
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name={isSpecialChar ? "check-circle" : "cancel"}
                                        size={16}
                                        color={isSpecialChar ? "green" : "red"}
                                    />
                                    <Text className="text-sm text-gray-600 ml-2" style={{ fontFamily:"Inter-Medium"}}>
                                        Bao gồm số ký và ký tự đặc biệt
                                    </Text>
                                </View>
                            </View>

                            {/* Reset and Login Button */}
                            <TouchableOpacity
                                className="w-full h-[50px] rounded-full justify-center items-center bg-[#FF5722]"
                                onPress={handleResetAndLogin}
                                disabled={!(isMinLength && isSpecialChar)}
                            >
                                <Text className="text-base text-white" style={{ fontFamily:"Inter-Medium"  }}>
                                    Đặt lại và đăng nhập
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    )
}

export default ResetPasswordScreen