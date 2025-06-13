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
export type RegisterTypeEmail = {
  token: string;
  code?: string;
  fullName: string;
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

export type RegisterByPhone = {
  token: string;
  phone: string;
};
export type RegistercodeByPhone = {
  token: string;
  code: string;
};
export type RegisterTypePhone = {
  token: string;
  code?: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
export type ProfileResponse = {
  data?: {
    id: string;
    userName: string;
    fullName: string;
    isBanned: boolean;
    isActive: boolean;
    lastActivityDate: string; // ISO 8601 format
    isLockedOut: boolean;
    lastLockoutDate: string;
    email: string;
    avatar: string;
    createDate: string;
    roles: Role[];
    permissions: Permission[];
    phone: string;
    language: string;
    address: string;
    nationality: string;
    city: string;
    dateOfBirth: Date;
    lastChangePassDate: string;
  };
  status?: string;
  message?: string;
};

export type UpdateEmail = {
  email: string;
};
export type UpdatePhone = {
  phone: string;
};
export type UpdateAvatar = {
  avatar: string;
};
export type updateAddress = {
  address: string;
  nationality: string;
  city: string;
};
export type UpdateProfile = {
  data: {
    fullName: string;
    avatar: string;
    language: string;
    address: string;
    nationality: string;
    city: string;
    dateOfBirth: Date;
  };
};

export type LoginByPhone = {
  phone: string;
  password: string;
  rememberMe: boolean;
};

export type SendCodeLogin = {
  sendType: "email" | "phone";
  phone: string;
  email: string;
};
export type VerifyCodeLogin = {
  publicKey: string;
  code: string;
};
export type ChangePassByCodeType = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};
export type VerifyChangePassCodeType = {
  token: string;
  code: string;
};
export type ChangePassCodeType = {
  type: "email" | "phone";
  phone?: string;
  email?: string;
};
export type Role = {
  id: number;
  name: string;
  description: string;
  sysCode: string;
  isDefault: boolean;
};

export type Permission = {
  id: number;
  name: string;
  description: string;
};

export type UserProfileResponse = {
  status: string;
  data: ProfileResponse;
};
export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
