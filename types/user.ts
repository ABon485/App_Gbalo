  export type LoginType = {
    account:string
    password: string
    rememberMe: boolean
  };
  export type LoginEmailType = {
      email:string
      password: string
      rememberMe: boolean
    };
    export type LoginByPhone = {
      phone:string
      password: string
      rememberMe: boolean
    };
    export type RegisterType = {
      userName:string
      email:string
      password: string
      confirmPassword:string

    };
