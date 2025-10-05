import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { devError } from "../utils/logger";

interface AuthState {
    user: User | null;
    loading: boolean;
    error?: string;
}

interface AuthContextType {
    authState: AuthState
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Hook to use anywhere inside of the codebase
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider') }; // Guard
    return context;
}

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true
    })

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    setAuthState(prev => ({
                        ...prev,
                        user,
                        loading: false
                    }))
                } else {
                    setAuthState(prev => ({
                        ...prev,
                        user: user || null,
                        loading: false
                    }))
                }
            } catch (error) {
                devError('Error With Auth State', error)

                setAuthState({
                    user: null,
                    loading: false,
                    error: error instanceof Error ? error.message : "An Unknown Error Occured"
                })
            }
        })

        return () => { unsubscribeAuth() }; // Cleanup Function
    }, [])

    const value: AuthContextType = {
        authState
    }
    
    return (
        <AuthContext.Provider value={value}>
            {!authState.loading && children}
        </AuthContext.Provider>
    )
}
