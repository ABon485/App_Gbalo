import api from "@/config/api";
import { LoginEmailType, LoginPhoneType, LoginType,RegisterType } from "@/types/user";

const authApi = {
  login: (formData: LoginType) => api.post("/login", formData),
  loginEmail: (formData: LoginEmailType) => api.post("/LoginByEmail", formData),
  loginPhone: (formData: LoginPhoneType) => api.post("/LoginPhone", formData),
  register: (formData: RegisterType) => api.post("Accounts/Resgiter", formData),


};

export default authApi;