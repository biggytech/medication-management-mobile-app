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

const AuthContext = createContext<{
  signIn: (authType: AuthType, data?: AuthData) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  getIsAuthenticated: () => boolean;
}>({
  signIn: async (authType: AuthType) => {},
  signOut: () => {},
  isLoading: true,
  getIsAuthenticated: () => false,
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
      await AuthService.loadAuthInfo();
      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isLoading,
        getIsAuthenticated: AuthService.getIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
