import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import AuthContext, {
  UserInfo,
  SeekerUser,
  ShelterUser,
  LoginError,
} from "./AuthContext";

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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserInfo();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      let userType = localStorage.getItem("user");
      const userID = localStorage.getItem("userID");

      if (!userType || !userID) {
        // Handle the case where userType or userID is not available
        return;
      }

      const response = await axios.get(`/accounts/${userType}/${userID}/`);

      if (userType === "seeker") {
        const {
          avatar,
          phone_number,
          first_name,
          last_name,
          location,
          preference,
        } = response.data;
        const seekerUserInfo: SeekerUser = {
          avatar,
          phone_number,
          first_name,
          last_name,
          location,
          preference,
        };
        setUserInfo(seekerUserInfo);
      } else if (userType === "shelter") {
        const { avatar, phone_number, shelter_name, address, description } =
          response.data;
        const shelterUserInfo: ShelterUser = {
          avatar,
          phone_number,
          shelter_name,
          address,
          description,
        };
        setUserInfo(shelterUserInfo);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      // Handle error
    }
  };

  const login = async (
    credentials: LoginCredentialsType,
  ): Promise<LoginError | null> => {
    try {
      const response = await axios.post("/api/token/", credentials);
      const { access, userID, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("userID", userID);
      localStorage.setItem("user", user);
      setToken(access);
      return null; // No error
    } catch (error: any) {
      let errorMessage = "No active accounts with given credentials found.";
      return { message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
    setToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ token, user: userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
