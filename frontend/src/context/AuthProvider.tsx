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
  const [user, setUser] = useState<string | null>(null);

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
      const { access, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(access);
      setUser(user);
    } catch (error) {
      // Handle error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
