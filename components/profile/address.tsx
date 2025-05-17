import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  content: string;
  title: string;
};

const AddressModal = ({ visible, onClose }: Props) => {
  const [address, setAddress] = useState("");

  function onSave(address: string): void {
    // Implement save logic
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Địa chỉ của bạn</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>
              Địa chỉ <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Quốc gia/Khu vực"
            />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Địa chỉ đường phố"
            />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Thành phố"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(address)}
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  body: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#F64A00",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
