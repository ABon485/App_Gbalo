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

type Props = {
  visible: boolean;
  onClose: () => void;
  content: string;
  title: string;
  onUpdatePhone: (newPhone: string) => void; 
};

const PhoneNumberModal = ({ visible, onClose, content, title, onUpdatePhone }: Props) => {
  const [phone, setPhone] = useState(content || "");
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const isValidPhone = (phone: string) => {
    const regex = /^\d{10,12}$/; 
    return regex.test(phone);
  };

  const fetchProfile = async () => {
    try {
      setIsSaving(true);
      if (!isValidPhone(phone)) {
        showToast({ message: "Vui lòng nhập số điện thoại hợp lệ (10-12 chữ số)", type: "error" });
        return false;
      }

      const response = await api.post("/Accounts/ChangePhone", {
        phone: phone,
      });
      console.log("Cập nhật số điện thoại thành công:", response.data.data);
      onUpdatePhone(phone); // Cập nhật số điện thoại trong component cha
      showToast({ message: "Cập nhật số điện thoại thành công", type: "success" });
      return true;
    } catch (error) {
      if ((error as any).response?.status === 401) {
        showToast({ message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", type: "error" });
      } else if ((error as any).response?.status === 400) {
        showToast({
          message: (error as any).response?.data?.message || "Số điện thoại không hợp lệ hoặc đã tồn tại.",
          type: "error",
        });
      } else {
        showToast({ message: "Cập nhật số điện thoại thất bại. Vui lòng thử lại.", type: "error" });
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = async () => {
    const success = await fetchProfile();
    if (success) {
      onClose(); // Chỉ đóng modal khi thành công
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
              Số điện thoại <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            onPress={onSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{isSaving ? "Đang lưu..." : "Lưu"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PhoneNumberModal;

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