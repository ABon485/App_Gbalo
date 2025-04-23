import api from "@/config/api";
import { LoginEmailType, LoginByPhone, LoginType,RegisterType, Registercode } from "@/types/user";

const authApi = {
  login: (formData: LoginType) => api.post("/login", formData),
  loginEmail: (formData: LoginEmailType) => api.post("/LoginByEmail", formData),
  loginPhone: (formData: LoginByPhone) => api.post("/LoginByPhone", formData),
  register: (formData: RegisterType) => api.post("Accounts/Resgiter", formData),
  registercode: (formData: Registercode) => api.post("/Accounts/SendResgiterCode", formData),
  resgiterConfirmByCode: (formData: RegisterType) => api.post("/Accounts/ResgiterByCode", formData),

};

export default authApi;