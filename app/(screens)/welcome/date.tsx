import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StyleSheet,
} from "react-native";
import styles from "@/styles/welcome/date";
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("./welcome")}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.progressWrapper}>
            <View style={styles.progressFill} />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Chào mừng bạn đến với Gbalo!</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn đã cung cấp thông tin, chỉ còn một bước nữa...
          </Text>
          <Text style={styles.question}>
            Vui lòng cho chúng tôi biết ngày sinh của bạn?
          </Text>

          {/* Date Picker Button */}
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={styles.dateButton}
          >
            <Text style={[styles.dateText, { color: date ? "#374151" : "#9CA3AF" }]}>
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
          <CustomButtonRN title="Tiếp tục" onPress={() => router.replace("./hobbies")} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default DateScreen;
