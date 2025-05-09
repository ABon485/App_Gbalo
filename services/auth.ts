
import api from "@/config/api";
import { LoginEmailType, LoginByPhone,VerifyCodeLogin,SendCodeLogin, LoginType,RegisterByEmail, RegisterByPhone, RegisterTypeEmail, RegistercodeByEmail, RegistercodeByPhone, ProfileResponse} from "@/types/user";

const authApi = {
  login: (formData: LoginType) => api.post("/login", formData),
  loginEmail: (formData: LoginEmailType) => api.post("/LoginByEmail", formData),
    loginPhone: (formData: LoginByPhone) => api.post("/LoginByPhone", formData),
    loginSendCode: (formData: SendCodeLogin) => api.post("/SendLoginCode", formData),
    loginByCode: (formData: VerifyCodeLogin) => api.post("/LoginByCode", formData),

  // register: (formData: RegisterTypeEmail) => api.post("Accounts/Resgiter", formData),

  registerEmail: (formData: RegisterByEmail) => api.post("/Accounts/SendResgiterCode", formData),

  registerPhone: (formData: RegisterByPhone) => api.post("/Accounts/SendResgiterCode", formData),

  registerVeryfyByEmail: (formData: RegistercodeByEmail) => api.post("/Accounts/VerifyResgiterCode", formData),

  registerVeryfyByPhone: (formData: RegistercodeByPhone) => api.post("/Accounts/VerifyResgiterCode", formData),

  registerConfirmByEmail: (formData: RegisterTypeEmail) => api.post("/Accounts/ResgiterByCode", formData),

  registerConfirmByPhone: (formData: RegisterTypeEmail) => api.post("/Accounts/ResgiterByCode", formData),

  UserProfile: (formData: ProfileResponse) => api.get("/Accounts/Profile", formData),


};

export default authApi;