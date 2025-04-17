import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButtonRN from "@/components/common/customButtonRN/index";

const DateScreen = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // iOS vẫn giữ picker mở
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "mm/dd/yy";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white px-5 pt-12">
        {/* Header */}
        <View className="flex-row items-center mt-2.5">
          <TouchableOpacity onPress={() => router.replace("./welcome")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View className="w-4/5 flex-row h-2 bg-gray-300 rounded ml-4 overflow-hidden">
            <View className="w-[66.666667%] bg-orange-500" />
            <View className="flex-1" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 pt-10">
          <Text className="text-xl font-bold mb-2">
            Chào mừng bạn đến với Gbalo!
          </Text>
          <Text className="text-sm text-gray-500 mb-8">
            Cảm ơn bạn đã cung cấp thông tin, chỉ còn một bước nữa...
          </Text>
          <Text className="text-xl font-bold mb-2 mt-10">
            Vui lòng cho chúng tôi biết ngày sinh của bạn?
          </Text>

          {/* Date Picker Button */}
          <TouchableOpacity
            onPress={() => setShow(true)}
            className="border border-gray-300 rounded-full py-4 px-5 my-8"
          >
            <Text
              className={`text-base ${
                !date ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {show && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === "android" ? "spinner" : "default"}
              onChange={onChange}
            />
          )}

          {/* Next button */}
          <CustomButtonRN
            title="Tiếp tục"
            onPress={() => router.replace("./hobbies")}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default DateScreen;
