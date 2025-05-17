import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const DeleteAccountModal = ({ visible, onClose, onDelete }: Props) => {
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
            <Text style={styles.title}>
              Bạn có chắc chắn xóa tài khoản của mình không?
            </Text>
            {/* <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.body}>
            <Text style={styles.note}>Lưu ý:</Text>
            <Text style={styles.item}>
              • Việc xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu liên quan và
              không thể khôi phục lại
            </Text>
            <Text style={styles.item}>
              • Bạn sẽ mất quyền truy cập vĩnh viễn vào tài khoản
            </Text>
            <Text style={styles.item}>
              • Nếu bạn chỉ muốn tạm thời ngưng sử dụng, hãy cân nhắc{" "}
              <Text style={styles.bold}>đăng xuất</Text> thay vì xóa tài khoản.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>Xóa tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;

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
    flex: 1,
    textAlign: "center",
  },
  body: {
    marginTop: 10,
  },
  note: {
    fontWeight: "600",
    marginBottom: 6,
  },
  item: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelText: {
    fontWeight: "bold",
    color: "#000",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FC0438",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
