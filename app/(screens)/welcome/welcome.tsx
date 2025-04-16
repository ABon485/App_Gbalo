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
          <View className="w-4/5 flex-row h-2 bg-gray-300 rounded ml-4 overflow-hidden">
            <View className="w-[33.333333%%] bg-orange-500" />
            <View className="flex-1" />
          </View>
        </View>

        <View className="flex-1 pt-10">
          <Text className="text-xl font-bold mb-2">
            Chào mừng bạn đến với Gbalo!
          </Text>
          <Text className="text-sm text-gray-500 mb-7.5">
            Hoàn tất thông tin cá nhân trước khi bắt đầu
          </Text>
          <Text className="text-xl font-bold mb-2 mt-10">Bạn đến từ đâu ?</Text>

          <View
            className={`border border-gray-300 rounded-full mb-10 mt-10 overflow-hidden ${
              Platform.OS === "android" ? "px-2.5" : ""
            }`}
          >
            {/* {error ? (
              <Text className="p-4 text-red-500">{error}</Text>
            ) : cities.length === 0 ? (
              <Text className="p-4"></Text>
            ) : ( */}
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
            {/* )} */}
          </View>

          <TouchableOpacity
            className="bg-orange-500 rounded-full py-4 items-center"
            onPress={() => router.replace("./date")}
          >
            <Text className="text-white text-base font-bold">Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Welcome;
