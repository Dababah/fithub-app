import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Ambil seluruh objek pengguna dari localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const login = (userData) => {
    // Simpan seluruh objek pengguna ke localStorage sebagai string
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (userData.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/member", { replace: true });
    }
  };

  const logout = () => {
    // Hapus seluruh objek pengguna dari localStorage
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Tambahkan hook biar bisa dipanggil dengan useAuth()
export function useAuth() {
  return useContext(AuthContext);
}