import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMeApi, loginApi, logoutApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkedAdminPath, setCheckedAdminPath] = useState(null);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const loading = isAdminRoute && !user && checkedAdminPath !== location.pathname;

  useEffect(() => {
    if (!isAdminRoute || user) return undefined;

    let active = true;
    getMeApi()
      .then((response) => {
        if (active) setUser(response.data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setCheckedAdminPath(location.pathname);
      });

    return () => {
      active = false;
    };
  }, [isAdminRoute, location.pathname, user]);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setCheckedAdminPath(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
