import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LinkedAccountModal = ({ visible, onClose }: Props) => {
  const onSelect = (provider: string) => {
    // Gọi logic liên kết tại đây
    console.log(`Selected provider: ${provider}`);
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
            <Text style={styles.title}>Liên kết tài khoản của bạn</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>
              Liên kết tài khoản (Google, Facebook, Apple ID)
            </Text>
            <Text style={styles.subLabel}>
              Chọn tài khoản mà bạn muốn liên kết
            </Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onSelect("google")}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
                }}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Gmail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onSelect("facebook")}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/500px-2023_Facebook_icon.svg.png",
                }}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => onSelect("apple")}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
                }}
                style={styles.icon}
              />
              <Text style={[styles.optionText, { marginLeft: 12 }]}>
                Apple ID
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LinkedAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
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
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "500",
  },
  subLabel: {
    fontSize: 12,
    marginBottom: 16,
    color: "#555",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
