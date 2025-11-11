import {
  type AuthData,
  AuthService,
  AuthType,
} from "@/services/auth/AuthService";

export const signIn = async (authType: AuthType, data?: AuthData) => {
  AuthService.setAuthStrategy(authType);
  const authInfo = await AuthService.authenticate(data);
  console.log("authInfo in signIn", authInfo);
};
