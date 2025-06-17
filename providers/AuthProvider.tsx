import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { router } from "expo-router";
import {
  type AuthData,
  AuthService,
  AuthType,
} from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";

const AuthContext = createContext<{
  signIn: (authType: AuthType, data?: AuthData) => Promise<void>;
  signOut: () => void;
  getToken: () => string | null;
  isLoading: boolean;
  enterWithoutLogin: () => void;
}>({
  signIn: async (authType: AuthType) => {},
  signOut: () => {},
  getToken: () => null,
  isLoading: true,
  enterWithoutLogin: () => {},
});

/**
 * Access the auth context as a hook
 */
export const useAuthSession = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps extends PropsWithChildren {}

/**
 * Provides user authentication
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const authServiceRef = useRef<AuthService>(new AuthService());

  useEffect(() => {
    (async (): Promise<void> => {
      await authServiceRef.current.init();
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (authType: AuthType, data?: AuthData) => {
    authServiceRef.current.setAuthStrategy(authType);
    await authServiceRef.current.authenticate(data);
    router.replace(AppScreens.HOME);
  }, []);

  const signOut = useCallback(async () => {
    await authServiceRef.current.removeToken();
    router.replace(AppScreens.LOGIN);
  }, []);

  const enterWithoutLogin = useCallback(async () => {
    authServiceRef.current.setAuthStrategy(AuthType.OFFLINE);
    await authServiceRef.current.authenticate();
    router.replace(AppScreens.HOME);
  }, []);

  const getToken = useCallback(() => authServiceRef.current.getToken(), []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        getToken,
        isLoading,
        enterWithoutLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
