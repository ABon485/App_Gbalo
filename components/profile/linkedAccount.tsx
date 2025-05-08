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

const LinkedAccountModal = ({ visible, onClose }: Props) => {
  const [linkedAccount, setLinkedAccount] = useState("");

  function onSave(linkedAccount: string): void {
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
            <Text style={styles.title}>Tài khoản liên kết của bạn</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>
              Tài khoản liên kết <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={linkedAccount}
              onChangeText={setLinkedAccount}
              placeholder="Nhập tài khoản liên kết"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(linkedAccount)}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LinkedAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
