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
import api from "@/config/api";
import { useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  visible: boolean;
  onClose: () => void;
  content: string;
  title: string;
  onUpdateEmail: (newEmail: string) => void;
  fetchProfile: () => Promise<void>; // Thêm prop fetchProfile
};

const EmailModal = ({
  visible,
  onClose,
  content,
  title,
  onUpdateEmail,
  fetchProfile,
}: Props) => {
  const [email, setEmail] = useState(content || "");
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 255;
  };

  const updateProfile = async () => {
  try {
    setIsSaving(true);
    if (!isValidEmail(email)) {
      showToast({ message: "Vui lòng nhập email hợp lệ", type: "error" });
      return false;
    }

    const response = await api.post("/Accounts/ChangeEmail", {
      email: email,
    });
    onUpdateEmail(email);
    await fetchProfile();

    // Cập nhật AsyncStorage
    const data = await AsyncStorage.getItem("data");
    if (data) {
      const parsedData = JSON.parse(data);
      parsedData.email = email;
      await AsyncStorage.setItem("data", JSON.stringify(parsedData));
    }

    showToast({ message: "Cập nhật email thành công", type: "success" });
    return true;
  } catch (error) {
    // ... xử lý lỗi
  } finally {
    setIsSaving(false);
  }
};

  const onSave = async () => {
    const success = await updateProfile();
    if (success) {
      onClose();
    }
  };

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
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            onPress={onSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EmailModal;

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
    paddingBottom: 30,
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
