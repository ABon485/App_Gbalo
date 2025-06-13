
import api from "@/config/api";
import {
  LoginEmailType, LoginByPhone, LoginType, VerifyCodeLogin, SendCodeLogin, RegisterByEmail,
  RegisterByPhone, RegisterTypeEmail, RegistercodeByEmail, RegisterTypePhone,
  RegistercodeByPhone, ProfileResponse, UpdateEmail, UpdatePhone, ChangePassByCodeType, VerifyChangePassCodeType,
  UpdateProfile, ChangePassCodeType, UpdateAvatar,updateAddress,
  ChangePasswordRequest
} from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authApi = {
  login: (formData: LoginType) => api.post("/login", formData),
  loginEmail: (formData: LoginEmailType) => api.post("/LoginByEmail", formData),
  loginPhone: (formData: LoginByPhone) => api.post("/LoginByPhone", formData),
  loginSendCode: (formData: SendCodeLogin) => api.post("/SendLoginCode", formData),
  loginByCode: (formData: VerifyCodeLogin) => api.post("/LoginByCode", formData),
  ChangePassByCode: (formData: ChangePassByCodeType) =>
    api.post("/Accounts/ChangePassByCode", formData, {
      headers: {
        "Content-Type": "application/json-patch+json",
        Accept: "text/plain",
      },
    }),
  sendChangePassCode: (formData: ChangePassCodeType) =>
    api.post("/Accounts/SendChangePassCode", formData, {
      headers: {
        "Content-Type": "application/json-patch+json",
        Accept: "text/plain",
      },
    }),
  VerifyChangePassByCode: (formData: VerifyChangePassCodeType) => api.post("/Accounts/VerifyChangePassCode", formData),



  // register: (formData: RegisterTypeEmail) => api.post("Accounts/Resgiter", formData),

  registerEmail: (formData: RegisterByEmail) => api.post("/Accounts/SendResgiterCode", formData),

  registerPhone: (formData: RegisterByPhone) => api.post("/Accounts/SendResgiterCode", formData),

  registerVeryfyByEmail: (formData: RegistercodeByEmail) => api.post("/Accounts/VerifyResgiterCode", formData),

  registerVeryfyByPhone: (formData: RegistercodeByPhone) => api.post("/Accounts/VerifyResgiterCode", formData),

  registerConfirmByEmail: (formData: RegisterTypeEmail) => api.post("/Accounts/ResgiterByCode", formData),

  registerConfirmByPhone: (formData: RegisterTypePhone) => api.post("/Accounts/ResgiterByCode", formData),

  UserProfile: (formData: ProfileResponse) => api.get("/Accounts/Profile", formData),

  updateEmail: (formData: UpdateEmail) => api.post("/Accounts/ChangeEmail", formData),

  updatePhone: (formData: UpdatePhone) => api.post("/Accounts/ChangePhone", formData),

  updatefullName: (formData: UpdateProfile) => api.post("/Accounts/ChangeProfile", formData),

  updateAddress: (formData: updateAddress) => api.post("/Accounts/ChangeAddress", formData),


  updateAvatar: (formData: UpdateAvatar) => api.post("/Accounts/ChangeAvatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  changePassword: async (formData: ChangePasswordRequest) => {
    const authDataString = await AsyncStorage.getItem("data")
    console.log("Stored Auth Data:", authDataString) // Log dữ liệu lưu trữ

    if (!authDataString) {
      console.log("Token Error: No auth data found")
      throw new Error("Không tìm thấy dữ liệu xác thực")
    }

    const authData = JSON.parse(authDataString)
    const token = authData.token
    console.log("Access Token:", token) // Log token để kiểm tra

    if (!token) {
      console.log("Token Error: No access token found in auth data")
      throw new Error("Không tìm thấy token xác thực")
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }
    console.log("Request Headers:", headers) // Log headers để kiểm tra

    return api.post("/Accounts/ChangePassword", formData, { headers })
  },

};

export default authApi;