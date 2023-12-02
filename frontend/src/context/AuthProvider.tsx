import { useState, useEffect } from "react";
import axios from "../api/axios";
import AuthContext from "./AuthContext";

type LoginCredentialsType = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (credentials: LoginCredentialsType) => {
    try {
      const response = await axios.post("/api/token/", credentials);
      const { access } = response.data;
      console.log(response);
      console.log(access);
      localStorage.setItem("token", access);
      setToken(access);
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
