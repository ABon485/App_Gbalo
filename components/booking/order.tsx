import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
};

const TourDetailModal = ({ visible, onClose, title }: Props) => {
  const [selectedDate, setSelectedDate] = useState("Thg 04 22-2025");
  const [selectedGuests, setSelectedGuests] = useState("1 khách");
  
  const pricePerPerson = 1988000;
  const totalPrice = 4961400; // bạn có thể tính dynamic nếu cần

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.header}>
            <View style={modalStyles.titleContainer}>
              <Text style={modalStyles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} style={modalStyles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={modalStyles.body}>
            <Text style={modalStyles.priceText}>
              Từ <Text style={modalStyles.priceHighlight}>1.988.000đ</Text> /người
            </Text>

            <View style={modalStyles.formContainer}>
              {/* Chọn ngày và số khách */}
              <View style={modalStyles.row}>
                <View style={modalStyles.column}>
                  <Text style={modalStyles.label}>Chọn ngày</Text>
                  <View style={modalStyles.pickerContainer}>
                    <Picker
                      selectedValue={selectedDate}
                      onValueChange={(itemValue) => setSelectedDate(itemValue)}
                    >
                      <Picker.Item label="Thg 04 22-2025" value="Thg 04 22-2025" />
                      <Picker.Item label="Thg 05 15-2025" value="Thg 05 15-2025" />
                    </Picker>
                  </View>
                </View>

                <View style={modalStyles.column}>
                  <Text style={modalStyles.label}>Khách</Text>
                  <View style={modalStyles.pickerContainer}>
                    <Picker
                      selectedValue={selectedGuests}
                      onValueChange={(itemValue) => setSelectedGuests(itemValue)}
                    >
                      <Picker.Item label="1 khách" value="1 khách" />
                      <Picker.Item label="2 khách" value="2 khách" />
                    </Picker>
                  </View>
                </View>
              </View>

              {/* Tổng giá */}
              <Text style={modalStyles.totalPrice}>
                đ {totalPrice.toLocaleString("vi-VN")}
              </Text>

              {/* Nút đặt */}
              <Pressable style={modalStyles.bookButton}>
                <Text style={modalStyles.bookButtonText}>Đặt ngay</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default TourDetailModal;

const modalStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "90%",
      backgroundColor: "#fff",
      borderRadius: 16,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    closeIcon: {
      color: "#333",
    },
    body: {
      padding: 16,
    },
    priceText: {
      fontSize: 16,
    },
    priceHighlight: {
      color: "#FF5722",
      fontWeight: "bold",
      fontSize: 18,
    },
    formContainer: {
      marginTop: 16,
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    row: {
      flexDirection: "row",
      marginBottom: 16,
    },
    column: {
      flex: 1,
      marginHorizontal: 4,
    },
    label: {
      marginBottom: 4,
      fontSize: 14,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 12,
      overflow: "hidden",
    },
    totalPrice: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    bookButton: {
      backgroundColor: "#FF5722",
      borderRadius: 24,
      paddingVertical: 12,
      alignItems: "center",
    },
    bookButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  