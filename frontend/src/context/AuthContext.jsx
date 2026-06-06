/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const payload = await request("/auth/me", { method: "GET" });
      setUser(payload.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    void init();
  }, []);

  const setAuthenticatedUser = (nextUser) => {
    setUser(nextUser || null);
  };

  const logout = async () => {
    await request("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      refreshUser,
      setAuthenticatedUser,
      logout,
    }),
    [isLoading, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}