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
import { UserFromApi } from "@/types/users";
import { APIService } from "@/services/APIService";

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

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const authInfo = await AuthService.loadAuthInfo();

        if (authInfo) {
          // setCurrentUser({
          //   id: authInfo.id,
          //   fullName: authInfo.fullName,
          //   isGuest: authInfo.isGuest,
          //   isDoctor: authInfo.isDoctor,
          // });

          const userProfile = await APIService.users.getProfile();

          console.log("userProfile", userProfile);

          setCurrentUser({
            id: userProfile.id,
            fullName: userProfile.fullName,
            isGuest: userProfile.isGuest,
            isDoctor: userProfile.isDoctor,
          });
        }
      } catch (err) {
        console.log("err");
        console.log(err);
        await signOut();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
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
