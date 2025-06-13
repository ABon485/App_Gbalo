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
import { updateAddress } from "@/types/user";
import RNPickerSelect from "react-native-picker-select";
import { useEffect } from "react";
import { UpdateCountry } from "@/types/tour";
import tourApi from "@/services/tour";

type Props = {
  visible: boolean;
  onClose: () => void;
  content: string;
  title: string;
  onUpdate: (newAddress: updateAddress) => void;
  fetchProfile: () => Promise<void>;
};

const AddressModal = ({
  visible,
  onClose,
  content,
  title,
  onUpdate,
  fetchProfile,
}: Props) => {
  const [addressData, setAddressData] = useState<updateAddress>({
    nationality: "",
    city: "",
    address: content || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);

  const isValidAddress = () => {
    return (
      addressData.nationality.trim() !== "" &&
      addressData.city.trim() !== "" &&
      addressData.address.trim() !== ""
    );
  };

  const updateAddressProfile = async () => {
    try {
      setIsSaving(true);
      if (!isValidAddress()) {
        showToast({
          message: "Vui lòng nhập đầy đủ quốc gia, thành phố và địa chỉ",
          type: "error",
        });
        return false;
      }

      const response = await api.post("/Accounts/ChangeAddress", addressData);
      console.log("Cập nhật địa chỉ thành công:", response.data.data);
      onUpdate(addressData);
      await fetchProfile();

      const data = await AsyncStorage.getItem("data");
      if (data) {
        const parsedData = JSON.parse(data);
        parsedData.nationality = addressData.nationality;
        parsedData.city = addressData.city;
        parsedData.address = addressData.address;
        await AsyncStorage.setItem("data", JSON.stringify(parsedData));
      }

      showToast({
        message: "Cập nhật địa chỉ thành công",
        type: "success",
      });
      return true;
    } catch (error) {
      if ((error as any).response?.status === 401) {
        showToast({
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
          type: "error",
        });
      } else if ((error as any).response?.status === 400) {
        showToast({
          message:
            (error as any).response?.data?.message ||
            "Dữ liệu địa chỉ không hợp lệ.",
          type: "error",
        });
      } else {
        showToast({
          message: "Cập nhật địa chỉ thất bại. Vui lòng thử lại.",
          type: "error",
        });
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = async () => {
    const success = await updateAddressProfile();
    if (success) {
      onClose(); // Close modal only on success
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCountries();
    }
  }, [visible]);

  const fetchCountries = async () => {
    try {
      const response = await tourApi.getCountries();
      const formatted = response.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setCountries(formatted);
    } catch (error) {
      showToast({ message: "Không thể tải danh sách quốc gia", type: "error" });
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
              Quốc gia/Khu vực <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={(value) =>
                  setAddressData({ ...addressData, nationality: value })
                }
                items={countries}
                placeholder={{ label: "Chọn quốc gia/khu vực", value: "" }}
                value={addressData.nationality}
                useNativeAndroidPickerStyle={false}
                Icon={() => <AntDesign name="down" size={16} color="#555" />}
                style={{
                  inputIOS: styles.dropdownInput,
                  inputAndroid: styles.dropdownInput,
                  placeholder: styles.dropdownPlaceholder,
                  iconContainer: styles.dropdownIcon,
                }}
              />
            </View>

            <Text style={styles.label}>
              Thành phố <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={addressData.city}
              onChangeText={(text) =>
                setAddressData({ ...addressData, city: text })
              }
              placeholder="Nhập thành phố"
            />

            <Text style={styles.label}>
              Địa chỉ đường phố <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={addressData.address}
              onChangeText={(text) =>
                setAddressData({ ...addressData, address: text })
              }
              placeholder="Nhập địa chỉ đường phố"
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
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdownInput: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#000",
  },
  dropdownPlaceholder: {
    color: "#999",
  },
  dropdownIcon: {
    top: 15,
    right: 12,
  },
});
