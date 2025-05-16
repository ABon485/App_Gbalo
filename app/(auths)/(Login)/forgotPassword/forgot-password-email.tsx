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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Stack, router } from "expo-router"
import authApi from "@/services/auth"
import { ChangePassCodeType } from "@/types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useToast } from "@/context/ToastContext"
import Feather from "react-native-vector-icons/Feather";

const ForgotPasswordEmailScreen = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { showToast } = useToast()
    const handleForgotEmailLogin = () => {
        router.push("/(auths)/(Login)/forgotPassword/forgot-password-phone");
    };

    const handleSendCode = async () => {
        // Validate email
        if (!email.trim()) {
            showToast({ type: "error", message: "Vui lòng nhập email." })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            showToast({ type: "error", message: "Email không hợp lệ." })
            return
        }

        setIsLoading(true)
        try {
            const sendCodePayload: ChangePassCodeType = {
                type: "email",
                phone: undefined,
                email: email,
            }

            console.log("Sending email to API:", email)
            const response = await authApi.sendChangePassCode(sendCodePayload)
            console.log("API response:", response)

            // Check if the response indicates success
            if (response.data?.success || response.data?.status === "Success") {
                console.log("Response data:", response.data.data)

                const publicKey = response.data.data?.publicKey || response.data.data?.token || ""
                await AsyncStorage.setItem("forgotPasswordToken", publicKey)
                console.log("Token stored:", publicKey)

                showToast({
                    type: "success",
                    message: "Mã xác nhận đã được gửi. Vui lòng kiểm tra email của bạn.",
                })

                router.push({
                    pathname: "/(auths)/(Login)/forgotPassword/verify-phone-forgotPassword",
                    params: { email: email },
                })
            } else {
                const errorMsg =
                    response.data?.errors?.account?.[0] ||
                    response.data?.message ||
                    "Không thể gửi mã xác minh. Vui lòng thử lại."

                showToast({
                    type: "error",
                    message: errorMsg,
                })

                if (errorMsg.includes("Tài khoản không tồn tại")) {
                    setTimeout(() => {
                        router.push("/(auths)/(register)/registerEmail/RegisterEmail")
                    }, 2000)
                }
            }
        } catch (error: any) {
            console.error("Lỗi gửi mã xác minh:", error.response?.data || error)
            const errorMessage =
                error.response?.data?.errors?.account?.[0] ||
                error.response?.data?.message ||
                "Đã xảy ra lỗi khi gửi mã xác minh. Vui lòng thử lại."

            showToast({
                type: "error",
                message: errorMessage,
            })

            if (errorMessage.includes("Tài khoản không tồn tại")) {
                setTimeout(() => {
                    router.push("/(auths)/(register)/registerEmail/RegisterEmail")
                }, 2000)
            }
        } finally {
            setIsLoading(false)
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
                            <Text style={styles.headerText}>Quên mật khẩu</Text>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons
                                    name="email-outline"
                                    size={22}
                                    color="#999999"
                                    style={styles.optionIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    placeholderTextColor="#999999"
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.sendCodeButton, isLoading && { opacity: 0.6 }]}
                                onPress={handleSendCode}
                                disabled={isLoading}
                            >
                                <Text style={styles.sendCodeButtonText}>
                                    {isLoading ? "Đang xử lý..." : "Gửi mã xác minh"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} onPress={handleForgotEmailLogin}>
                                <Feather
                                    name="phone"
                                    size={20}
                                    color="#999999"
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.socialButtonText}>Tiếp tục với số điện thoại</Text>
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
    icon: {
        marginRight: 10,
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
    optionIcon: {
        marginRight: 10,
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 43,
        borderRadius: 25,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    socialButtonText: {
        fontSize: 13,
        color: "#333",
        flex: 1,
        textAlign: "center",
        paddingRight: 23,
        fontFamily: 'Inter-Medium'
    },
})

export default ForgotPasswordEmailScreen