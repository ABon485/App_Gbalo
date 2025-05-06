export type LoginType = {
  account: string;
  password: string;
  rememberMe: boolean;
};
export type LoginEmailType = {
  email: string;
  password: string;
  rememberMe: boolean;
};
export type LoginByPhone = {
  phone: string;
  password: string;
  rememberMe: boolean;
};
export type RegisterTypeEmail = {
  token: string;
  code?: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;  
};
export type RegisterByEmail = {
  token: string;
  email: string;
};
export type RegistercodeByEmail = {
  token: string;
  code: string;
};
export type RegisterTypePhone = {
  token: string;
  code?: string;
  userName: string;
  phone: string;
  password: string;
  confirmPassword: string;  
};
export type RegisterByPhone = {
  token: string;
  phone: string;
};
export type RegistercodeByPhone = {
  token: string;
  code: string;
};
