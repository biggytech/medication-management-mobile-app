import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
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
import { UserFromApi } from "@/types/users";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";

export type CurrentUser = Pick<
  UserFromApi,
  "id" | "fullName" | "isGuest" | "isDoctor"
>;

export const CURRENT_USER_DEFAULT = {
  id: 0,
  fullName: "Unknown",
  isGuest: true,
  isDoctor: false,
};

const AuthContext = createContext<{
  signIn: (authType: AuthType, data?: AuthData) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  getIsAuthenticated: () => boolean;
  currentUser: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser) => void;
}>({
  signIn: async (authType: AuthType) => {},
  signOut: () => {},
  isLoading: true,
  getIsAuthenticated: () => false,
  currentUser: CURRENT_USER_DEFAULT,
  setCurrentUser: () => {},
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

  const [currentUser, setCurrentUser] =
    useState<CurrentUser>(CURRENT_USER_DEFAULT);

  const loadUserProfile = useCallback(async () => {
    try {
      const authInfo = await AuthService.loadAuthInfo();

      console.log("authInfo in loadUserProfile", authInfo);

      if (authInfo) {
        const userProfile = await APIService.users.getProfile();

        console.log("userProfile", userProfile);

        setCurrentUser({
          id: userProfile.id,
          fullName: userProfile.fullName,
          isGuest: userProfile.isGuest,
          isDoctor: userProfile.isDoctor,
        });

        console.log("CURRENT USER UPDATED!", userProfile);
      }
    } catch (err) {
      console.log("err");
      console.log(err);
      await signOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      await loadUserProfile();
    })();
  }, [loadUserProfile]);

  const signInHandler = useCallback(
    async (authType: AuthType, data?: AuthData) => {
      console.log("SIGN IN!");
      await signIn(authType, data);
      console.log("LOAD PROFILE!");
      await loadUserProfile();
      router.replace(AppScreens.HOME);
    },
    [loadUserProfile],
  );

  return (
    <AuthContext.Provider
      value={{
        signIn: signInHandler,
        signOut,
        isLoading,
        getIsAuthenticated: AuthService.getIsAuthenticated,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
