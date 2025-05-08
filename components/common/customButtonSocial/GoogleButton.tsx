"use client";

import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Define prop types
interface GoogleButtonProps {
  onPress?: () => void; // Made onPress optional
  disabled: boolean;
}

// Use React.FC with typed props
const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress, disabled }) => {
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  // Google Auth Configuration
  const webClientId = '883445305791-6a7t1nufbd8hfdd2qotm5ad15ckf76qe.apps.googleusercontent.com';
  const iosClientId = '883445305791-m898a0vmmputamcf7teadkkrva3ppqq5.apps.googleusercontent.com';
  const androidClientId = '883445305791-8t8iqd2mhl8h1t7i82308h126upiuc82.apps.googleusercontent.com';

  // Use Expo Auth Proxy for redirect URI
  const redirectUri = makeRedirectUri({
    preferLocalhost: false,
  });
  console.log("Redirect URI used:", redirectUri); // Debug: Log redirect URI

  const [authRequest, authResponse, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
    redirectUri,
  });

  useEffect(() => {
    setRequest(authRequest);
    setResponse(authResponse);
  }, [authRequest, authResponse]);

  // Handle Google Auth response
  useEffect(() => {
    console.log("Google Auth Response:", JSON.stringify(response, null, 2));
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("Access token received:", token);

      if (token) {
        console.log("Navigating to /(tabs)/assistant");
        router.replace("/(tabs)/assistant");
      } else {
        Alert.alert("Error", "No token received. Please try again.");
      }
    } else if (response?.type === "error") {
      Alert.alert("Error", "Google login failed. Please try again.");
      console.log("Error details:", response);
    } else if (response?.type === "dismiss") {
      Alert.alert("Cancelled", "Login was cancelled.");
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert("Error", "System not ready. Please try again later.");
      return;
    }

    try {
      await promptAsync();
    } catch (error) {
      Alert.alert("Error", "An error occurred during Google login.");
      console.log("Login error:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.socialButton, disabled && styles.disabledButton]}
      onPress={onPress || handleGoogleLogin} // Use provided onPress or default to handleGoogleLogin
      disabled={disabled}
    >
      <Image source={require("@/assets/images/Google.png")} className="w-6 h-6" />
      <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
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
    fontFamily: 'Inter-Medium'
  },
  disabledButton: {
    opacity: 0.5,
  }
});

export default GoogleButton;