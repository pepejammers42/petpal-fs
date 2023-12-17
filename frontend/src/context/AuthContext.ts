import { createContext } from "react";

export type AuthUser = {
  email: string;
  avatar: string;
  phone_number: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  }
};

export type SeekerUser = AuthUser & {
  first_name: string;
  last_name: string;
  location: string;
  preference?: string;
};

export type ShelterUser = AuthUser & {
  shelter_name: string;
  address: string;
  description: string;
};

export type UserInfo = SeekerUser | ShelterUser;

type AuthContextType = {
  token: string | null;
  user: UserInfo | null;
  login: (credentials: LoginCredentialsType) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: any) => Promise<void>;
  updateUserPassword: (passwordData: any) => Promise<void>;
  updateNotificationPreferences: (notificationData: any) => void;

};

type LoginCredentialsType = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
