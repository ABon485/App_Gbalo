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
      email: string;
      avatar: string;
      createDate: string;
      roles: [];
      permissions: [];
      phone: string;
      language: string;
      address: string;
      nationality: string;
      dateOfBirth: Date;
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
export type UpdateProfile = {
  fullName: string;
  avatar: string;
  language: string;
  address: string;
  nationality: string;
  dateOfBirth: Date;
}

export type LoginByPhone = {
    phone: string;
    password: string;
    rememberMe: boolean;
  };
export type SendCodeLogin = {
  sendType: "email" | "phone";
  phone: string;
  // email: string;
}
export type VerifyCodeLogin = {
  publicKey: string;
  code: string;
}
export type ChangePassByCodeType = {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
export type VerifyChangePassCodeType = {
  token: string;
  code: string;
}
