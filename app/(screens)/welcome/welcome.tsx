import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StyleSheet,
} from "react-native";
import styles from "@/styles/welcome/welcome";
import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import CustomButtonRN from "@/components/common/customButtonRN/index";

interface City {
  id: string | number;
  name: string;
  value: string;
}

const Welcome = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get<City[]>(
          "https://67fdc9fd3da09811b1768e41.mockapi.io/Languages"
        );
        if (Array.isArray(response.data)) {
          setCities(response.data);
        } else {
          setError("Invalid data format from server");
          setCities([]);
        }
      } catch (error) {
        setError("Failed to load cities. Please try again.");
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.replace("/(landingpages)/onboarding")}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarFill} />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Chào mừng bạn đến với Gbalo!</Text>
          <Text style={styles.subtitle}>
            Hoàn tất thông tin cá nhân trước khi bắt đầu
          </Text>

          <Text style={styles.question}>Bạn đến từ đâu ?</Text>

          <View
            style={[
              styles.pickerWrapper,
              Platform.OS === "android" ? styles.pickerPadding : {},
            ]}
          >
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="Chọn" value="" />
              {cities.map((city) => (
                <Picker.Item
                  key={city.id}
                  label={city.name}
                  value={city.value}
                />
              ))}
            </Picker>
          </View>

          <CustomButtonRN
            title="Tiếp tục"
            onPress={() => router.replace("./date")}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Welcome;
