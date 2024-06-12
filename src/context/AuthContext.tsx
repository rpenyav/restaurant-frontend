import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import axios from "../api/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  error: string | null;
}

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  address: string;
  postalcode: string;
  phone1: string;
  isActive: boolean;
}

interface DecodedToken {
  email: string;
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        fetchUser(decoded.userId, token).finally(() => {
          setLoading(false);
          setUserLoaded(true);
        });
        setIsAuthenticated(true);
      } else {
        Cookies.remove("access_token");
        setLoading(false);
        setUserLoaded(true);
      }
    } else {
      setLoading(false);
      setUserLoaded(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { access_token } = response.data;
      Cookies.set("access_token", access_token);
      const decoded: DecodedToken = jwtDecode(access_token);
      await fetchUser(decoded.userId, access_token);
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error logging in");
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    setIsAuthenticated(false);
    setUser(null);
    setUserLoaded(false);
  };

  const fetchUser = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      setError("Error fetching user data");
    }
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      loading,
      userLoaded,
      login,
      logout,
      user,
      error,
    }),
    [isAuthenticated, loading, userLoaded, user, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
