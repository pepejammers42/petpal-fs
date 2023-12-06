import { createContext } from "react";

type AuthUser = {
  avatar: string;
  phone_number: string;
  created_at: string;
};

type SeekerUser = AuthUser & {
  first_name: string;
  last_name: string;
  location: string;
  preference?: string;
};

type ShelterUser = AuthUser & {
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
};

type LoginCredentialsType = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
