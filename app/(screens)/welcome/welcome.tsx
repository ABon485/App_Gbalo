import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
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
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setCities(response.data);
        } else {
          console.error("API did not return an array:", response.data);
          setError("Invalid data format from server");
          setCities([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError("Failed to load cities. Please try again.");
        setCities([]);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white px-5 pt-12">
        <View className="flex-row items-center mt-2.5">
          <TouchableOpacity onPress={() => router.replace("/(landingpages)/onboarding")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View className="w-4/5 flex-row h-1.5 bg-gray-300 rounded ml-4 overflow-hidden">
            <View className="w-[33.333333%%] bg-orange-500" />
            <View className="flex-1" />
          </View>
        </View>

        <View className="flex-1 pt-10">
          <Text
            style={{
              fontFamily: "Mulish-ExtraBold",
              fontSize: 24,
              color: "black",
            }}
          >
            Chào mừng bạn đến với Gbalo!
          </Text>
          <Text
            style={{ fontFamily: "Mulish-Extra", fontSize: 16, color: "black" }}
          >
            Hoàn tất thông tin cá nhân trước khi bắt đầu
          </Text>
          <Text
            style={{
              fontFamily: "Mulish-ExtraBold",
              fontSize: 24,
              color: "black",
              paddingTop:100,
            }}
          >
            Bạn đến từ đâu ?
          </Text>

          <View
            className={`border border-gray-300 rounded-full mb-10 mt-20 overflow-hidden ${
              Platform.OS === "android" ? "px-2.5" : ""
            }`}
          >
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={{ height: 53, width: "100%" }}
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
