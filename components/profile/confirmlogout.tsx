import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";

interface ConfirmLogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmLogoutModal({
  visible,
  onCancel,
  onConfirm,
}: ConfirmLogoutModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <X size={20} color="#000" />
          </TouchableOpacity>

          <Text style={styles.message}>
            Bạn có chắc chắn muốn đăng xuất không?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    right: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF5722",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF5722",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelText: {
    color: "#FF5722",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
