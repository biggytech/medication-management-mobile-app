import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type AuthData,
  AuthService,
  AuthType,
} from "@/services/auth/AuthService";
import { signIn } from "@/utils/auth/signIn";
import { signOut } from "@/utils/auth/signOut";
import { enterWithoutLogin } from "@/utils/auth/enterWithoutLogin";

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

  useEffect(() => {
    (async (): Promise<void> => {
      await AuthService.loadToken();
      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        getToken: AuthService.getToken,
        isLoading,
        enterWithoutLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
