import React, { type PropsWithChildren } from 'react';
import {router} from "expo-router";
import {createContext, MutableRefObject, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AuthService} from "@/services/auth/AuthService";

const AuthContext = createContext<{
    signIn: (token: string) => void;
    signOut: () => void
    authServiceRef: MutableRefObject<AuthService> | null,
    isLoading: boolean
}>({
    signIn: () => null,
    signOut: () => null,
    authServiceRef: null,
    isLoading: true
});

// Access the context as a hook
export const useAuthSession = () => {
    return useContext(AuthContext);
}

interface AuthProviderProps extends PropsWithChildren {}

/**
 * Provides user authentication
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);

    const authServiceRef = useRef<AuthService>(new AuthService());

    useEffect(() => {
        (async ():Promise<void> => {
            await authServiceRef.current.init();
            setIsLoading(false);
        })()
    }, []);

    const signIn = useCallback(async (token: string) => {
        await authServiceRef.current.setToken(token);
        router.replace('/')
    }, []);

    const signOut = useCallback(async () => {
        await authServiceRef.current.removeToken();
        router.replace('/login');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                authServiceRef,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};