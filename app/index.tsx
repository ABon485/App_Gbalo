import React, { useEffect } from "react";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { useRootNavigationState } from "expo-router";
import '@/config/i18n'; 

export default function IndexScreen() {
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (rootNavigationState?.key) {
      router.replace("/profile"); 
    }
  }, [rootNavigationState?.key]);  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Redirecting...</Text>
    </View>
  );
}
