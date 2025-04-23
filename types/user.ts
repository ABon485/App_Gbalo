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
export type RegisterType = {
  token: string;
  code: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type Registercode = {
  email: string;
};
