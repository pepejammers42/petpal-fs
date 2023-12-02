import { createContext } from "react";

type AuthContextType = {
  token: string | null;
  login: (credentials: LoginCredentialsType) => Promise<void>;
  logout: () => void;
};

type LoginCredentialsType = {
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
