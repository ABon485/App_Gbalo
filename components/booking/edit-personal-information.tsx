import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

interface EditPersonalInformationProps {
    visible: boolean;
    onClose: () => void;
    onSave: (personalInfo: {
        fullName: string;
        phone: string;
        email: string;
    }) => void;
    initialFullName: string;
    initialPhone: string;
    initialEmail: string;
}

const EditPersonalInformation = ({
    visible,
    onClose,
    onSave,
    initialFullName,
    initialPhone,
    initialEmail,
}: EditPersonalInformationProps) => {
    const [fullName, setFullName] = useState(initialFullName || "");
    const [phone, setPhone] = useState(initialPhone || "");
    const [email, setEmail] = useState(initialEmail || "");

    const handleSave = () => {
        onSave({ fullName, phone, email });
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalContainer}
                >
                    <Text style={styles.title}>Chỉnh sửa thông tin liên lạc</Text>

                    <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Nhập họ và tên"
                        placeholderTextColor="#aaa"
                    />

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Số điện thoại"
                                keyboardType="phone-pad"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Hủy bỏ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveText}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
        fontWeight: "bold",
    },
    required: {
        color: "red",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: "#f9f9f9",
        marginBottom: 15,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    column: {
        flex: 1,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    cancelButton: {
        backgroundColor: "#e0e0e0",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    saveButton: {
        backgroundColor: "#f4511e",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    cancelText: {
        color: "#000",
        fontWeight: "bold",
    },
    saveText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default EditPersonalInformation;
