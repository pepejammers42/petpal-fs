import { useState, useEffect, useContext } from "react";
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
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    setUser(localStorage.getItem("user"));
    setUserID(localStorage.getItem("userID"));
  }, [token]);

  const login = async (credentials: LoginCredentialsType) => {
    try {
      const response = await axios.post("/api/token/", credentials);
      const { access, user, userID } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("user", user);
      localStorage.setItem("userID", userID);
      setToken(access);
      setUser(user);
      setUserID(user.id);
    } catch (error) {
      // Handle error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
    setToken(null);
    setUser(null);
    setUserID(null);
  };
  return (
    <AuthContext.Provider value={{ token, user, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
