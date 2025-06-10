"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import authApi from "@/services/auth"
import { ChangePasswordRequest } from "@/types/user"
import { useToast } from "@/context/ToastContext"

interface ChangePasswordScreenProps {
  visible: boolean
  onClose: () => void
}

const ChangePasswordScreen = ({ visible, onClose }: ChangePasswordScreenProps) => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useToast()

  // Password validation
  const isMinLength = newPassword.length >= 8
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const isSpecialChar = hasNumber && hasSpecialChar

  const handleSubmit = async () => {
    setIsLoading(true)

    // Log input fields
    console.log("Input Fields:", {
      oldPassword,
      newPassword,
      confirmPassword,
      logoutOtherDevices,
    })

    // Log validation results
    console.log("Validation Results:", {
      isMinLength,
      isSpecialChar,
      hasNumber,
      hasSpecialChar,
    })

    // Validate inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Vui lòng điền đầy đủ tất cả các trường",
      })
      setIsLoading(false)
      console.log("Validation Error: Missing required fields")
      return
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      })
      setIsLoading(false)
      console.log("Validation Error: New password and confirm password do not match")
      return
    }

    if (!isMinLength || !isSpecialChar) {
      showToast({
        type: "error",
        heading: "Lỗi",
        message: "Mật khẩu mới phải dài ít nhất 8 ký tự và bao gồm số, ký tự đặc biệt",
      })
      setIsLoading(false)
      console.log("Validation Error: Password does not meet requirements")
      return
    }

    // Prepare form data for API call
    const formData: ChangePasswordRequest = {
      oldPassword,
      newPassword,
      confirmPassword,
    }

    try {
      // Call the changePassword API
      const response = await authApi.changePassword(formData)
      console.log("API Response:", response.data)

      // Handle successful response
      if (response.data.status === "Success") {
        // Clear inputs on success
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setLogoutOtherDevices(false)

        // Show success toast
        showToast({
          type: "success",
          heading: "Thành công",
          message: "Đổi mật khẩu thành công!",
        })

        // Close modal
        onClose()
      }
    } catch (err: any) {
      // Log detailed error
      console.log("Full API Error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      })

      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      if (err.message === "Không tìm thấy dữ liệu xác thực" || err.message === "Không tìm thấy token xác thực") {
        errorMessage = "Không tìm thấy token xác thực. Vui lòng đăng nhập lại."
      }

      showToast({
        type: "error",
        heading: "Lỗi",
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Đóng">
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Old Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu cũ"
              placeholderTextColor="#999"
              value={oldPassword}
              secureTextEntry={!showOldPassword}
              onChangeText={setOldPassword}
              accessibilityLabel="Mật khẩu cũ"
            />
            <TouchableOpacity
              onPress={() => setShowOldPassword(!showOldPassword)}
              accessibilityLabel={showOldPassword ? "Ẩn mật khẩu cũ" : "Hiện mật khẩu cũ"}
              accessibilityRole="button"
            >
              <MaterialIcons name={showOldPassword ? "visibility" : "visibility-off"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirements}>
            <View style={styles.requirementItem}>
              <View style={[styles.errorIcon, !isMinLength && styles.errorIconActive]}>
                <MaterialIcons
                  name={isMinLength ? "check-circle" : "cancel"}
                  size={16}
                  color={isMinLength ? "green" : "red"}
                />
              </View>
              <Text style={styles.requirementText}>Dài ít nhất 8 ký tự</Text>
            </View>
            <View style={styles.requirementItem}>
              <View style={[styles.errorIcon, !isSpecialChar && styles.errorIconActive]}>
                <MaterialIcons
                  name={isSpecialChar ? "check-circle" : "cancel"}
                  size={16}
                  color={isSpecialChar ? "green" : "red"}
                />
              </View>
              <Text style={styles.requirementText}>Bao gồm số và ký tự đặc biệt</Text>
            </View>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor="#999"
              value={newPassword}
              secureTextEntry={!showNewPassword}
              onChangeText={setNewPassword}
              accessibilityLabel="Mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              accessibilityLabel={showNewPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
              accessibilityRole="button"
            >
              <MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Confirm New Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#999"
              value={confirmPassword}
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
              accessibilityLabel="Xác nhận mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              accessibilityLabel={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
              accessibilityRole="button"
            >
              <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Logout from other devices */}
          <View style={styles.checkboxContainer}>
            <Pressable
              style={[styles.checkbox, logoutOtherDevices && styles.checkboxChecked]}
              onPress={() => setLogoutOtherDevices(!logoutOtherDevices)}
              accessibilityLabel={
                logoutOtherDevices ? "Hủy đăng xuất khỏi các thiết bị khác" : "Đăng xuất khỏi các thiết bị khác"
              }
              accessibilityRole="checkbox"
            >
              {logoutOtherDevices && <MaterialIcons name="check" size={16} color="#fff" />}
            </Pressable>
            <Text style={styles.checkboxLabel}>
              Đăng xuất khỏi các thiết bị khác. Hãy chọn mục này nếu người khác từng dùng tài khoản của bạn.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityLabel="Xác nhận đổi mật khẩu"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>{isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    marginTop: 230,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 100,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 15,
  },
  requirements: {
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  errorIconActive: {
    backgroundColor: "#FF5722",
  },
  requirementText: {
    fontSize: 14,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF5722",
    borderColor: "#FF5722",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FF5722",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#FF8A65",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default ChangePasswordScreen