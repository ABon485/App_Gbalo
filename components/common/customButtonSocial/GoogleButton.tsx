"use client";

import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

interface GoogleButtonProps {
  onPress?: () => void;
  disabled: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress, disabled }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const webClientId = "883445305791-6a7t1nufbd8hfdd2qotm5ad15ckf76qe.apps.googleusercontent.com";
  const iosClientId = "883445305791-m898a0vmmputamcf7teadkkrva3ppqq5.apps.googleusercontent.com";
  const androidClientId = "883445305791-8t8iqd2mhl8h1t7i82308h126upiuc82.apps.googleusercontent.com";

  const redirectUri = makeRedirectUri({
    scheme: "com.tantren.app.gbalo",
    native: "exp://192.168.68.112:8081",
  });
  console.log("Redirect URI:", redirectUri);

  const [authRequest, authResponse, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
    redirectUri,
  });

  useEffect(() => {
    if (!authResponse) return;

    if (authResponse.type === "success") {
      const token = authResponse.authentication?.accessToken;
      if (token) {
        router.replace("/(tabs)/assistant");
      } else {
        Alert.alert("Lỗi", "Không nhận được token. Vui lòng thử lại.");
      }
    } else if (authResponse.type === "error") {
      Alert.alert("Lỗi", "Đăng nhập Google thất bại. Vui lòng thử lại.");
    } else if (authResponse.type === "dismiss") {
      Alert.alert("Hủy", "Đăng nhập bị hủy.");
    }
  }, [authResponse]);

  const handleGoogleLogin = async () => {
    if (!authRequest) {
      Alert.alert("Lỗi", "Hệ thống chưa sẵn sàng. Vui lòng thử lại sau.");
      return;
    }
    try {
      setIsLoading(true);
      const result = await promptAsync();
      console.log("Kết quả đăng nhập:", JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng nhập Google.");
      console.log("Lỗi đăng nhập:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.socialButton, (disabled || isLoading) && styles.disabledButton]}
      onPress={onPress || handleGoogleLogin}
      disabled={disabled || isLoading}
    >
      <Image source={require("@/assets/images/Google.png")} className="w-6 h-6" />
      <Text style={styles.socialButtonText}>
        {isLoading ? "Đang đăng nhập..." : "Tiếp tục với Google"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 43,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
  },
  socialButtonText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
    textAlign: "center",
    paddingRight: 23,
    fontFamily: "Inter-Medium",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default GoogleButton;