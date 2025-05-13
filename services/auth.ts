
import api from "@/config/api";
import {
  LoginEmailType, LoginByPhone, LoginType, VerifyCodeLogin, SendCodeLogin, RegisterByEmail,
  RegisterByPhone, RegisterTypeEmail, RegistercodeByEmail, RegisterTypePhone,
  RegistercodeByPhone, ProfileResponse, UpdateEmail, UpdatePhone, ChangePassByCodeType, VerifyChangePassCodeType,
  UpdateProfile, ChangePassCodeType
} from "@/types/user";

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
};

export default authApi;