import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface AddDiscountCodeProps {
    visible: boolean;
    onClose: () => void;
    onApply: (code: string) => void;
}

const AddDiscountCode = ({ visible, onClose, onApply }: AddDiscountCodeProps) => {
    const [discountCode, setDiscountCode] = useState("");

    const handleApply = () => {
        if (discountCode.trim()) {
            onApply(discountCode);
            onClose();
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Nhập mã ưu đãi</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Input + Apply Button Row */}
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={discountCode}
                            onChangeText={setDiscountCode}
                            placeholder="Nhập mã ưu đãi"
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Áp dụng</Text>
                        </TouchableOpacity>
                    </View>

                    {/* List ưu đãi */}
                    <ScrollView style={styles.discountList}>
                        {/* Ưu đãi 1 */}
                        <View style={styles.discountItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.discountText}>Giảm 20% Vé Bana Hill mùa hè</Text>
                                <Text style={styles.discountCode}>Mã ưu đãi: HRH5T4</Text>
                                <Text style={styles.discountDate}>Hết hạn sau 24 giờ</Text>
                            </View>
                            <TouchableOpacity style={styles.useButton}>
                                <Text style={styles.useButtonText}>Sử dụng</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Ưu đãi 2 */}
                        <View style={styles.discountItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.discountText}>Giảm 20% Vé Bana Hill mùa hè</Text>
                                <Text style={styles.discountCode}>Mã ưu đãi: HRH5T4</Text>
                                <Text style={styles.discountDate}>Hết hạn sau 24 giờ</Text>
                            </View>
                            <TouchableOpacity style={styles.useButton}>
                                <Text style={styles.useButtonText}>Sử dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        maxHeight: "80%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: "#fff",
        marginRight: 8,
        fontSize: 14,
    },
    applyButton: {
        backgroundColor: "#FF4500",
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    applyButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    discountList: {
        marginTop: 5,
    },
    discountItem: {
        backgroundColor: "#FFF5F5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: "row", // Thêm dòng này
        justifyContent: "space-between",
        alignItems: "center",
    },
    discountText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    discountCode: {
        fontSize: 13,
        color: "#666",
        marginBottom: 4,
    },
    discountDate: {
        fontSize: 12,
        color: "#999",
        marginBottom: 10,
    },
    useButton: {
        alignSelf: "flex-end",
        borderColor: "#FF4500",
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 3,
        paddingHorizontal: 7,
        backgroundColor: "#fff",
    },
    useButtonText: {
        color: "#FF4500",
        fontWeight: "bold",
        fontSize: 13,
    },
});

export default AddDiscountCode;
