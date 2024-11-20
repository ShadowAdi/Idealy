"use client";

import { VerifyUser } from "@/actions/AuthActions";
import { AuthContextProps, UserProps } from "@/lib/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
});

const FetchUser = async (
  setUser: (user: UserProps | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  const data = await VerifyUser();
  if (data) {
    setUser(data?.user);
  }
  setLoading(false);
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if localStorage is available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      FetchUser(setUser, setLoading);
    } else {
      setLoading(false); // Stop loading if there's no TOKEN
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}