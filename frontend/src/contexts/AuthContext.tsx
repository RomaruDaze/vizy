import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { User, UserCredential, AuthError } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = useCallback((email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const login = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      // Handle account-exists-with-different-credential error
      if (authError.code === "auth/account-exists-with-different-credential") {
        // The pending credential is available in error.credential
        // You can save it and guide the user to sign in with their existing provider
        throw new Error(
          "An account already exists with this email using a different sign-in method. Please sign in with your original method first."
        );
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      login,
      signup,
      logout,
      loginWithGoogle,
      loading,
    }),
    [currentUser, login, signup, logout, loginWithGoogle, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
